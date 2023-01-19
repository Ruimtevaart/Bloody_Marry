const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

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