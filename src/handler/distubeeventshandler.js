const { Client } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { DisTube } = require("distube");
/**
 * 
 * @param {Client} client client
 * @param {DisTube} player distube
 */
module.exports = (client, player) => {
    const embed = new EmbedBuilder().setColor('Random');
    const status = queue =>
        `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(', ') || 'Off'}\` | Loop: \`${queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
        }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
    player
        .on('playSong', async (queue, song) => {
            if (!queue.autoplay) {
                queue.toggleAutoplay();
            }
            let playEmbed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`🎵 Playing `)
                .setThumbnail(song.thumbnail)
                .setDescription([
                    `[${song.name}](${song.url})`,
                    `**Requested By**: ${song.user}`,
                    `**Duration**: ${song.formattedDuration.toString()}`,
                    status(queue)
                ].join('\n'))
                .setTimestamp();
            await queue.textChannel.send({
                embeds: [playEmbed]
            })
        })
        .on('addSong', async (queue, song) => {

            const playEmbed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`🎵 Added to Queue `)
                .setThumbnail(song.thumbnail)
                .setDescription([
                    `[${song.name}](${song.url})`,
                    `**Added By**: ${song.user}`,
                    `**Duration**: ${song.formattedDuration.toString()}`,
                    status(queue)
                ].join('\n'))
                .setTimestamp();

            await queue.textChannel.send({
                embeds: [playEmbed]
            })
        })
        .on('addList', async (queue, playlist) => {
            await queue.textChannel.send({
                embeds: [embed.setDescription(
                    `🎶 | Added \`${playlist.name}\` playlist (${playlist.songs.length
                    } songs) to queue\n${status(queue)}`)
                ]
            })
        })
        .on('error', (channel, e) => {
            console.error(e)
        })
        .on('empty', channel => channel.send({
            embeds: [embed.setDescription('Voice channel is empty! Leaving soon...')
            ]
        }))
        .on('searchNoResult', async (interaction, query) =>
            await interaction.channel.send({
                embeds: [embed.setDescription(` No result found for \`${query}\`!`)
                ]
            })
        )
        .on('finish', queue => queue.textChannel.send({
            embeds: [embed.setDescription(`Finished Playing Songs!`)
            ]
        }))
};
