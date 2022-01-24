const { Client, MessageEmbed } = require('discord.js');
const Distube = require('distube').default;
const config = require('./config');
const client = new Client({
  intents: 641,
});

const distube = new Distube(client, {
  emitNewSongOnly: false,
  searchSongs: 0,
});

client.on('ready', () => {
  console.log('Music is playing ...');
  client.user.setActivity('Your Songs', { type: 'PLAYING' });

  distube.on('error', (channel, error) =>
    channel.send('An error encountered: ' + error)
  );
});

//// distube Events

// Queue status
const status = (queue) =>
  `Volume: \`${queue.volume}%\` | Filter: \`${
    queue.filters.join(', ') || 'Off'
  }\` | Loop: \`${
    queue.repeatMode
      ? queue.repeatMode === 2
        ? 'All Queue'
        : 'This Song'
      : 'Off'
  }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``;

// DisTube event listeners, more in the documentation page
distube
  .on('playSong', (queue, song) => {
    let playEmbed = new MessageEmbed()
      .setColor('#FFA400')
      .setTitle(`🎵 Playing `)
      .setThumbnail(song.thumbnail)
      .setDescription(`[${song.name}](${song.url})`)
      .addField('Requested By', `${song.user}`, true)
      .addField('Duration', `${song.formattedDuration.toString()}`, true)
      .setFooter(status(queue), song.user.displayAvatarURL({ dynamic: true }));

    queue.textChannel.send({ embeds: [playEmbed] });
  })
  .on('addSong', (queue, song) => {
    let playEmbed = new MessageEmbed()
      .setColor('#FFA400')
      .setTitle(`🎵 Added to Queue`)
      .setThumbnail(song.thumbnail)
      .setDescription(`[${song.name}](${song.url})`)
      .addField('Requested By', `${song.user}`, true)
      .addField('Duration', `${song.formattedDuration.toString()}`, true)
      .setFooter(`Hey`, song.user.displayAvatarURL({ dynamic: true }));

    queue.textChannel.send({ embeds: [playEmbed] });
  })
  .on('addList', (queue, playlist) =>
    queue.textChannel.send(
      `Added \`${playlist.name}\` playlist (${
        playlist.songs.length
      } songs) to queue\n${status(queue)}`
    )
  );
// *************************************************************************************

client.on('messageCreate', async (message) => {
  if (
    !message.guild ||
    message.author.bot ||
    !message.content.startsWith(config.prefix)
  )
    return;

  let args = message.content.slice(config.prefix.length).trim().split(' ');
  let cmd = args.shift()?.toLowerCase();

  if (cmd === 'ping') {
    message.channel.send(`>>> Ping :- \`${client.ws.ping}\``);
  } else if (cmd === 'play') {
    let search = args.join(' ');
    let channel = message.member.voice.channel;

    if (!channel) {
      message.react('🙄');
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor('#FFA400')
            .setDescription(`>>> Please join a voice channel`)
            .setFooter(
              `${message.author.username}`,
              message.author.displayAvatarURL({ dynamic: true })
            ),
        ],
      });
    }

    if (!search) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor('#FFA400')
            .setDescription(`>>> Please provide song name or link`)
            .setFooter(
              `${message.author.username}`,
              message.author.displayAvatarURL({ dynamic: true })
            ),
        ],
      });
    } else {
      message.react('🥰');
    }

    distube.play(message, search);
  } else if (cmd === 'skip') {
    let queue = distube.getQueue(message.guildId);

    if (!message.guild.me.voice.channel) {
      return message.reply(`>>> Nothing Playing 😶`);
    }
    message.reply(`>>> Skipped`) && queue.skip();
  }

  if (cmd === 'stop') {
    distube.stop(message);
    message.channel.send('Stopped the music!');
  }

  if (cmd === 'resume') distube.resume(message);

  if (cmd === 'pause') distube.pause(message);

  if (cmd === 'help') {
    return message.reply({
      embeds: [
        new MessageEmbed()
          .setColor('RANDOM')
          .setTitle('**Commands**')
          .setDescription(`**>>> Bot prefix : . **`)
          .addField(' play : ', ' Plays song ', true)
          .addField(' skip : ', ' Skip playing song ', true)
          .addField(' queue : ', ' check all requested songs ', true)
          .addField(' help : ', ' all commands ', true)
          .addField(' stop : ', ' stops playing ', true)
          .addField(' resume :', ' resumes playing ', true)
          .addField(' pause : ', ' Pauses playing ', true)
          .setFooter(
            `${message.author.username}`,
            message.author.displayAvatarURL({ dynamic: true })
          ),
      ],
    });
  }

  if (cmd === 'queue') {
    const queue = distube.getQueue(message.guildId);

    // let playEmbed = new MessageEmbed().setColor('#FFA400');

    if (!queue) {
      message.channel.send('Nothing playing right now!');
    } else {
      message.channel.send(
        `Current queue:\n${queue.songs
          .map(
            (song, id) =>
              `**${id ? id : 'Playing'}**. ${song.name} - \`${
                song.formattedDuration
              }\``
          )
          .slice(0, 10)
          .join('\n')}`
      );
    }
  }
});
// ******************************************************************************

client.login(config.token);
