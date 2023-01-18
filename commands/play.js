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
        // let connection = await getVoiceConnection(interaction.guild.id);
        // if (connection == null) {
        
        // const connection = null;
        var requestArray = null;
        // var resource = null;
        // var subscription = null;
        // var player = null;
        let connection = getVoiceConnection(interaction.guild.id);
        const fileName = dir + interaction.guild.id + '.json';
        // let play = get
        // if (connection == null && !fs.existsSync(fileName)) {
        if (connection == null) {
            // console.log("triggered");
            // var requestArray = [];
            connection = joinVoiceChannel({
                channelId: interaction.member.voice.channelId,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });
            var requestFile = fs.openSync(fileName, 'w');
            fs.writeFile(fileName, JSON.stringify([]), (error) => {if (error) console.log(error);});
            // console.log(requestFile);
            try {
                await entersState(connection, VoiceConnectionStatus.Ready, 5000);
                console.log("Connected: " + interaction.member.voice.channel.name);
                await interaction.reply('Playing: ' + interaction.options.getString('url'));
                // await sleep(5000);
            } catch (error) {
                console.log("Voice Connection not ready within 5s.", error);
                return null;    
            }
            const player = createAudioPlayer();
            console.log(interaction.options.getString('url'));
            const stream = await playdl.stream(interaction.options.getString('url'));
            const resource = createAudioResource(stream.stream, { inputType: stream.type });
            player.play(resource);
            // await interaction.reply({ content: fileName, ephemeral: true });
            // return;
        } else {
            // requestArray.push(interaction.options.getString('url'));
            requestArray = JSON.parse(fs.readFileSync(fileName));
            // await interaction.reply({ content: JSON.stringify(requestArray), ephemeral: true });
            // return;
        }

        // const player = createAudioPlayer();
        // console.log(interaction.options.getString('url'));
        // const stream = await playdl.stream(interaction.options.getString('url'));
        
        connection.on('stateChange', (oldState, newState) => {
            console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
        });
        player.on('stateChange', (oldState, newState) => {
            console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
        });

        // console.log(stream);
        // const resource = createAudioResource(stream.stream, { inputType: stream.type });
        // const subscription = connection.subscribe(player);


        // try {
        //     await entersState(connection, VoiceConnectionStatus.Ready, 5000);
        //     console.log("Connected: " + interaction.member.voice.channel.name);
        //     await interaction.reply('Playing: ' + interaction.options.getString('url'));
        //     // await sleep(5000);
        // } catch (error) {
        //     console.log("Voice Connection not ready within 5s.", error);
        //     return null;    
        // }

        
        
        // player.play(resource);

        player.on(AudioPlayerStatus.Idle, () => {
            // console.log(requestArray);
            requestArray = JSON.parse(fs.readFileSync(fileName));
            if (requestArray == []) {
                player.stop();
                connection.destroy();
            } else {
                const stream = playdl.stream(interaction.options.getString('url'));
                const resource = createAudioResource(stream.stream, { inputType: stream.type });
                player.play(resource);
                fs.writeFile(fileName, JSON.stringify({}), (error) => {if (error) console.log(error);});
            }
        });

        player.on('error', error => {
            console.error(error);
            // console.error(`Error: ${error} with resource`);
            // console.error(`Error: ${error.message} with resource`);
        })

    },
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}