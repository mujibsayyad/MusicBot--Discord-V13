const { Client, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');

const client = new Client({
  intents: 641,
});

const distube = new DisTube(client, {
  emitNewSongOnly: false,
  searchSongs: 0,
  youtubeDL: false,
  plugins: [new YtDlpPlugin()],
});

// Queue status
const status = (queue) =>
  `Volume: \`${queue.volume}%\` | Filter: \`${
    queue.filters.join(', ') || 'Off'
  }\` | Loop: \`${
    queue.repeatMode
      ? queue.repeatMode === 0
        ? 'All Queue'
        : 'This Song'
      : 'Off'
  }\` | Autoplay: \`${(queue.autoplay = 'On')}\``;

// DisTube event listeners

distube
  .on('playSong', (queue, song) => {
    let playEmbed = new MessageEmbed()
      .setColor('#FFA400')
      .setTitle(`🎵 Playing `)
      .setThumbnail(song.thumbnail)
      .setDescription(`[${song.name}](${song.url})`)
      .addField('Requested By', `${song.user}`, true)
      .addField('Duration', `${song.formattedDuration.toString()}`, true)
      .setFooter({
        text: status(queue),
        iconURL: song.user.displayAvatarURL({ dynamic: true }),
      });

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
      .setFooter({
        text: status(queue),
        iconURL: song.user.displayAvatarURL({ dynamic: true }),
      });

    queue.textChannel.send({ embeds: [playEmbed] });
  })
  .on('addList', (queue, playlist) =>
    queue.textChannel.send(
      `Added \`${playlist.name}\` playlist (${
        playlist.songs.length
      } songs) to queue\n${status(queue)}`
    )
  )
  .on('error', (channel, error) =>
    channel.send('An error encountered: ' + error)
  );

// * *************************************************************************************

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('play a song')
    .addStringOption((option) =>
      option.setName('input').setDescription('Plays Song').setRequired(true)
    ),

  async execute(interaction) {
    let channel = interaction.member.voice.channel;
    // console.log(channel);

    const search = interaction.options.getString('input');

    console.log(search);

    if (!channel) {
      // interaction.react('🙄');
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor('#FFA400')
            .setDescription(`>>> Please join a voice channel`)
            .setFooter({
              text: interaction.author,
              iconURL: interaction.author.displayAvatarURL({ dynamic: true }),
            }),
        ],
      });
    }

    if (!search) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor('#FFA400')
            .setDescription(`>>> Please provide song name or link`)
            .setFooter({
              text: interaction.author.username,
              iconURL: interaction.author.displayAvatarURL({ dynamic: true }),
            }),
        ],
      });
    } else {
      console.log(`Playing a ${search} song`);

      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor('#FFA400')
            .setDescription(`🎵 Playing ...`),
        ],
      });
    }

    distube.play(channel, search, {
      member: interaction.member,
      textChannel: interaction.channel,
      interaction,
    });
  },
};
