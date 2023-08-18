
const { options, member, guild } = interaction;

const guildSetup = await p.guildSetup.findFirst({
    where: {
        guildId: interaction.guildId,
    },
});

const vcchannel = guildSetup
    ? ((await client.channels.fetch(guildSetup.channelId)))
    : (member)?.voice?.channel;
if (!vcchannel)
    return await interaction.editReply({
        embeds: [new EmbedBuilder().setColor('Red').setDescription("You need to be in a voice channel to use this command")]
    });
const userChannel = (member)?.voice?.channel;
if (userChannel?.id !== vcchannel.id) {
    return await interaction.editReply({
        embeds: [new EmbedBuilder().setColor('Red').setDescription(`I am only allowed to play music in <#${vcchannel.id}>. Please join that channel and try again.`)]
    });
}
if (guild.members.me.voice.channelId && vcchannel.id !== guild.members.me.voice.channelId) {
    return await interaction.editReply({
        embeds: [new EmbedBuilder().setColor('Red').setDescription(`I am already playing music in <#${guild.members.me.voice.channelId}>. Please join that channel and try again.`)]
    });
}

try {

    const musicEmbed = new EmbedBuilder()
        .setColor('Red');

    switch (options.getSubcommand()) {
        case 'play': {
            const query = await player.play(vcchannel, options.getString('query'), {
                nodeOptions: {
                    metadata: { interaction: interaction, requestedBy: interaction.user },
                    leaveOnEnd: true,
                    leaveOnEndCooldown: 1000 * 60,
                    leaveOnEmpty: true,
                    leaveOnEmptyCooldown: 1000 * 60,
                    leaveOnStop: true,
                    leaveOnStopCooldown: 1000 * 60,
                },
            });
            return await interaction.editReply({ embeds: [musicEmbed.setDescription(`**${query.track.title}** Request recived. `)] })
        }
        case 'volume': {
            const volume = options.getNumber('percent')
            const currentqueue = usePlayer(guild.id);
            currentqueue.queue.connection
            currentqueue.setVolume(volume) ? musicEmbed.setDescription(`Volume set to ${volume} .`) : musicEmbed.setDescription('An error occured.');
            return await interaction.editReply({ embeds: [musicEmbed] })
        }
        case 'settings': {
            const currentqueue = usePlayer(guild.id);
            const isnotQueue = currentqueue.queue.tracks.size > 0 ? true : false;
            switch (options.getString('options')) {
                case 'queue': {
                    if (isnotQueue) {
                        return await interaction.editReply({
                            embeds: [
                                musicEmbed.setDescription(
                                    `Queue is empty`
                                )
                            ]
                        })
                    }
                    return await interaction.editReply({
                        embeds: [
                            musicEmbed.setDescription(
                                `${currentqueue.queue.tracks.map(
                                    (song, id) => {
                                        if (id <= 25) return `\n**${id + 1}**. ${song.title} . \`${song.duration}\``
                                    }
                                )}`
                            )
                        ]
                    })
                }
                case 'skip': {
                    const trackname = `(${currentqueue.queue.currentTrack})[${currentqueue.queue.currentTrack}]`
                    currentqueue.skip() ? musicEmbed.setDescription(`⏩ Skipping ${trackname} .`) : musicEmbed.setDescription('An error occured while skipping song.');
                    return await interaction.editReply({ embeds: [musicEmbed] })
                }
                case 'pause': {
                    if (currentqueue.isPaused()) {
                        return await interaction.editReply({ embeds: [musicEmbed.setDescription(`Player is already paused.`)] });
                    }
                    // console.log(currentqueue.pause());
                    currentqueue.pause() ? musicEmbed.setDescription(`⏸️ Song has been pause.`) : musicEmbed.setDescription('An error occured.');

                    return await interaction.editReply({ embeds: [musicEmbed] })
                }
                case 'resume': {
                    if (currentqueue.isPlaying()) {
                        return await interaction.editReply({ embeds: [musicEmbed.setDescription(`Player is already playing songs.`)] });
                    }
                    // console.log(currentqueue.pause());
                    currentqueue.resume() ? musicEmbed.setDescription(`⏯️ Song has been resumed.`) : musicEmbed.setDescription('An error occured.');
                    return await interaction.editReply({ embeds: [musicEmbed] })
                }
                case 'stop': {
                    currentqueue.stop() ? musicEmbed.setDescription(`⏹️ Music has been stopped.`) : musicEmbed.setDescription('An error occured.');
                    return await interaction.editReply({ embeds: [musicEmbed] })
                }

            }
            // return await interaction.editReply({ embeds: [musicEmbed.setDescription(`**${query.track.title}** Request recived. `)] })
        }
    }


} catch (err) {
    console.log(err);
    await interaction.editReply({ embeds: [new EmbedBuilder().setColor('Red').setDescription("An error occured, try again later")] });
}