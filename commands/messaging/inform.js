const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inform')
    .setDescription('Lets James know an update occurred'),
    async execute(interaction) {
      await interaction.user.send('');
    }
};