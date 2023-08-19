const { GuildMember } = require('discord.js');
const { Client, EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { player } = require('../..');
const { Playlist } = require('distube');
const { SearchResultType } = require('distube');
const { SearchResultPlaylist } = require('distube');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a Song.')
        .addStringOption(opt =>
            opt.setName('query')
                .setDescription('Enter song name or url')
                .setRequired(true)
        )
        .setDMPermission(false),

    /**
     * @param {ChatInputCommandInteraction} interaction intractions
     * @param {client} client client
     * @param {EmbedBuilder} EmbedBuilder embed bind
     */
    async execute(interaction, client) {
        await interaction.deferReply({ fetchReply: true });
        try {

            const { options, member, guild } = interaction;

            const vcchannel = member?.voice?.channel;
            if (!vcchannel) {
                return await interaction.editReply({
                    embeds: [new EmbedBuilder().setColor('Red').setDescription("You need to be in a voice channel to use this command")]
                });
            }
            if (guild.members.me.voice.channelId && vcchannel.id !== guild.members.me.voice.channelId) {
                return await interaction.editReply({
                    embeds: [new EmbedBuilder().setColor('Red').setDescription(`I am already playing music in <#${guild.members.me.voice.channelId}>. Please join that channel and try again.`)]
                });
            }
            const query = options.getString('query')
            const playlistPattern = /^.*(list=)([^#\&\?]*).*/;
            if (playlistPattern.test(query)) {

            const results = await player.search(query,{type:'playlist'});
                if (!results) {
                    return await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Red')
                                .setDescription(`No Result Found`)
                        ]
                    })
                }

                await player.play(vcchannel, results, {
                    interaction,
                    textChannel: interaction.channel,
                    member: member,
                })

            } else {
                await player.play(vcchannel, query, {
                    interaction,
                    textChannel: interaction.channel,
                    member: member,
                });
            }
            if(!player.getQueue(guild.id).autoplay) {
                player.getQueue(guild.id).toggleAutoplay();
            }
            return await interaction.editReply({ embeds: [new EmbedBuilder().setColor('Random').setDescription(`Request recived. `)] })

        } catch (error) {
            console.log(error);
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`An error occured while running command. Pls try again!`)
                ]
            })
        }
    }
};
