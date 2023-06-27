const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes, Client, Collection, Events, GatewayIntentBits, Partials, ChannelType } = require("discord.js");
const { clientId, guildId, token } = require("./config.json");

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages], 'partials': [Partials.Channel] });

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');

const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {

  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) 
  {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[ERROR] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

client.on(Events.InteractionCreate, async interaction => {

  // There are interactions that are not slash commands, which we don't want to talk about
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true});
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
  console.log(`Registered command ${interaction}`);
});

client.on(Events.MessageCreate, async message => {

  // We don't want to reply to itself
  if (message.author.id == client.user.id) return;

    if (message.channel.type == ChannelType.DM)
      message.author.send('Gatsby believed in the green light, the orgastic future that year by year recedes before us. It eluded us then, but that\'s no matter—tomorrow we will run faster, stretch out our arms farther. . . . And one fine morning——');
});

// When the client is ready, it is run
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord utilizing token
client.login(token);
