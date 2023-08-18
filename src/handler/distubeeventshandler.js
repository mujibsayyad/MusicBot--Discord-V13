const { EmbedBuilder } = require("discord.js");

module.exports = (client, player) => {
    const embed = new EmbedBuilder().setColor('Random')
    const status = queue =>
        `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(', ') || 'Off'}\` | Loop: \`${queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
        }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
    player
        .on('playSong', (queue, song) =>
            queue.textChannel.send({
                embeds: [embed.setDescription(` | Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user
                    }\n${status(queue)}`)
                ]
            })
        )
        .on('addSong', (queue, song) =>
            queue.textChannel.send({
                embeds: [embed.setDescription(
                    `| Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`)
                ]
            })
        )
        .on('addList', (queue, playlist) =>
            queue.textChannel.send({
                embeds: [embed.setDescription(
                    `| Added \`${playlist.name}\` playlist (${playlist.songs.length
                    } songs) to queue\n${status(queue)}`)
                ]
            })
        )
        .on('error', (channel, e) => {
            console.error(e)
        })
        .on('empty', channel => channel.send({
            embeds: [embed.setDescription('Voice channel is empty! Leaving soon...')
            ]
        }))
        .on('searchNoResult', (interaction, query) =>
            interaction.channel.send({
                embeds: [embed.setDescription(` | No result found for \`${query}\`!`)
                ]
            })
        )
        .on('finish', queue => queue.textChannel.send({
            embeds: [embed.setDescription(`Finished Playing Songs!`)
            ]
        }))
};
