const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

module.exports = {
    data: new SlashCommandBuilder().setName('play').setDescription('Play a song from a youtube URL'),
    async execute(interaction) {
        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channelId,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        // console.log(interaction.member.voice.channelId);
        // console.log(interaction.guild.id);
        // console.log(interaction.guild.voiceAdapterCreator);


        const player = createAudioPlayer();
        // console.log(player);
        // const subscription = connection.subscribe(player);
        // console.log(subscription);
        const resource = createAudioResource('./Pipe.mp3');
        // console.log(resource);
        // player.play(resource);

        console.log(interaction.guildId);
        // console.log(connection2);

        // try {
        //     await entersState(connection, VoiceConnectionStatus.Ready, 5000);
        //     console.log("Connected: " + interaction.member.voice.channel.name);
        // } catch (error) {
        //     console.log("Voice connection not ready within 5s.", error);
        //     return null;
        // }
        // connection.subscribe(player);
        // player.play(resource);
        // player.on('error', error => {
        //     console.error(`Error: ${error.message} with resource`);
        // });


        


        await sleep(2000);
        connection.destroy();

        await interaction.reply('interaction');
    },
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}