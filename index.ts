import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  SlashCommandBuilder,
  type Interaction,
  REST,
  Routes,
} from 'discord.js';
import * as commands from './commands';

declare module 'discord.js' {
  export interface Client {
    commands: Collection<any, any>;
  }
}

export interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: Interaction) => void;
}

const commandsArray = Object.values(commands).map((command) => ({
  name: command.data.name,
  description: command.data.description,
}));

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

Object.values(commands).forEach((command) => {
  if (!('data' in command) || !('execute' in command)) return;
  client.commands.set(command.data.name, command);
});

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

try {
  console.log(`Started refreshing ${commandsArray.length} application (/) commands.`);

  const data = await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),
    { body: commandsArray },
  );

  console.log(`Successfully reloaded ${commandsArray.length} application (/) commands.`);
} catch (error) {
  console.error(error);
}

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  }
});
