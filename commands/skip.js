const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, VoiceConnectionStatus, getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');
const playdl = require('play-dl');
const fs = require('fs');
const dir = './songRequests/';

module.exports = {
    data: new SlashCommandBuilder().setName('skip').setDescription('Skip currently plating song'),
    async execute(interaction) {
        if (interaction.member.voice.channelId == null) {
            await interaction.reply('You need to join a voice channel first! Bozo');
            return;
        }
        const connection = getVoiceConnection(interaction.guild.id);
        if (connection == null) {
            await interaction.reply('The bot is not currently playing anything');
            return;
        }
        connection.state.subscription.player.stop();
        await interaction.reply('Skipped!');
    },
};