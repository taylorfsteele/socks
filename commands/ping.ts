import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '..';

export const ping: Command = {
  data: new SlashCommandBuilder().setName('ping').setDescription('woe betide all those who enter here'),
  execute: async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    await interaction.reply({ content: 'ponnngggg', ephemeral: true });
  },
};
