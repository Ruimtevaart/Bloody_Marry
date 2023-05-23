const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('help').setDescription('Info about the bot and its commands'),
    async execute(interaction) {
        await interaction.reply('Šita botą sukūrė Grantas (Ruimtevaart) tai jis ofc bus baisiai bugovas tai praneškit jeigu rasit kokius bugus. \nKol kas iš normalių komandų jis turi tik /play kuris daro paiešką iš pateikto prompto. Vėliau bus pridėta daugiau funkcionalumo.');
    },
};