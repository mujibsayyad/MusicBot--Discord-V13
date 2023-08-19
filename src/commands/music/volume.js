const { GuildMember } = require('discord.js');
const { Client, EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { player } = require('../..');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Alter volume.')
        .addNumberOption(opt => opt
            .setName('percent')
            .setDescription('Enter volume in percentage | 1 to 100')
            .setMinValue(1)
            .setMaxValue(100)
            .setRequired(true)
        )
        .setDMPermission(false),

    /**
     * @param {ChatInputCommandInteraction} interaction intractions
     * @param {client} client client
     * @param {EmbedBuilder} EmbedBuilder embed bind
     */
    async execute(interaction, client) {
        await interaction.deferReply({fetchReply:true});
        try {

            const { member, options, guild } = interaction;

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
            const queue = player.getQueue(guild.id);
            if (!queue) {
                return await interaction.editReply({
                    embeds: [new EmbedBuilder().setColor('Red').setDescription("There is nothing in the queue right now!")]
                });
            }

            queue.setVolume(options.getNumber('percent'))
            return await interaction.editReply({ embeds: [new EmbedBuilder().setColor('Random').setDescription(`Volume set to \`${options.getNumber('percent')}\``)] })

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
