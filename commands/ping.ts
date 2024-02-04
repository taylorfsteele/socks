import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '..';

export const ping: Command = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Michael look, I made a bot'),
  execute: async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    await interaction.reply({ content: 'ponnngggg', ephemeral: true });
  },
};
