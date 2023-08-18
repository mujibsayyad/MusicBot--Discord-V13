const fs = require('fs');
const { Client, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config');

const client = new Client({
  intents: 641,
});

const commands = [];
client.commands = new Collection();

const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

// Place your client and guild ids here
const clientId = config.client_id;
const guildId = config.guild_id;

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
  console.log(`Loaded ${file}`);
}

const rest = new REST({ version: '9' }).setToken(config.token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.on('ready', () => {
  console.log(`${client.user.tag} is playing ...`);

  client.user.setActivity(`WATCHING ${client.guilds.cache.size} SERVERS`);
});

// ? *************************************************************************************

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;
  // const string = interaction.options.getString('input');
  // console.log('name is' + string);
  // console.log(command.data.name);

  try {
    await command.execute(interaction);
  } catch (error) {
    console.log(error);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }
});

// ? *************************************************************************************

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;

  const prefix = config.prefix;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  const cmd = client.commands.get(command);
  if (!cmd) return;

  if (cmd.inVoiceChannel && !message.member.voice.channel) {
    return message.channel.send(`You must be in a voice channel!`);
  }
});

// ******************************************************************************

client.login(config.token);
