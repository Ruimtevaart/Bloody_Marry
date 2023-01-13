const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

module.exports = {
    data: new SlashCommandBuilder().setName('play').setDescription('Play a song from a youtube URL'),
    async execute(interaction) {
        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });




        const player = createAudioPlayer();
        
        const resource = createAudioResource('./Pipe.mp3');

        player.play(resource);


        const subscription = connection.subscribe(player);


        await sleep(2000);
        connection.destroy();

        await interaction.reply('interaction');
    },
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}