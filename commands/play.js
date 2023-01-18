const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, VoiceConnectionStatus, getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');
// const ytdl = require('ytdl-core');
const playdl = require('play-dl');
const fs = require('fs');
const dir = './songRequests/'

module.exports = {
    data: new SlashCommandBuilder().setName('play').setDescription('Play a song from a youtube URL').addStringOption(option => option.setName('url').setDescription('URL of the youtube video you want to be played').setRequired(true)),
    async execute(interaction) {
        if (interaction.member.voice.channelId == null) {
            await interaction.reply('You need to join a voice channel first! Bozo');
            return;
        }
        var connection = getVoiceConnection(interaction.guild.id);
        const fileName = dir + interaction.guild.id + '.json';

        if (connection != null) {
            let requestArray = JSON.parse(fs.readFileSync(fileName));
            requestArray.push(interaction.options.getString('url'));
            overWriteFile(fileName, requestArray);
            await interaction.reply('Added to queue: ' + interaction.options.getString('url'));
            return;
        } else {
            connection = joinVoiceChannel({
                channelId: interaction.member.voice.channelId,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });
            connection.on('stateChange', (oldState, newState) => {
                console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
            });
            var player = createAudioPlayer();
            var subscription = connection.subscribe(player);
            player.on('stateChange', (oldState, newState) => {
                console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
            });
            player.on('error', error => {
                console.error(`Error: ${error.message} with resource`);
            });
            try {
                await entersState(connection, VoiceConnectionStatus.Ready, 5000);
                console.log("Connected: " + interaction.member.voice.channel.name);
                await interaction.reply('Playing: ' + interaction.options.getString('url'));
            } catch (error) {
                console.log("Voice Connection not ready within 5s.", error);
                return;    
            }
            const stream = await playdl.stream(interaction.options.getString('url'));
            const resource = createAudioResource(stream.stream, { inputType: stream.type });
            player.play(resource);
            
            let fileDescriptor = fs.openSync(fileName, 'w');
            overWriteFile(fileName, []);
            
            player.on(AudioPlayerStatus.Idle, async () => {
                let requestArray = JSON.parse(fs.readFileSync(fileName));
                if (requestArray.length === 0) {
                    fs.rm(fileName, { force: true }, (error) => {if (error) console.log("unlink error: " + error);});
                    fs.close(fileDescriptor, (error) => {if (error) console.log("close error: " + error);})
                    player.stop();
                    connection.destroy();
                } else {
                    const nextSong = requestArray.shift();
                    const stream = await playdl.stream(nextSong);
                    const resource = createAudioResource(stream.stream, { inputType: stream.type });
                    player.play(resource);
                    overWriteFile(fileName, requestArray);
                }
            });
        }
        
    },
};


function overWriteFile (fileName, content) {
    fs.writeFileSync(fileName, JSON.stringify(content), (error) => {if (error) console.log("overWriteFile error: " + error);});
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}