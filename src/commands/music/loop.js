const { GuildMember } = require('discord.js');
const { Client, EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { player } = require('../..');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Loop the queue.')
        .addNumberOption(opt => opt
            .setName('mode')
            .setDescription('Select mode.')
            .addChoices(
                { name: 'disable', value: 0, },
                { name: 'song', value: 1 },
                { name: 'queue', value: 2 },
            )
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
            const queue = player.getQueue(guild.id);
            if (!queue) {
                return await interaction.editReply({
                    embeds: [new EmbedBuilder().setColor('Red').setDescription("There is nothing in the queue right now!")]
                });
            }
            const modetoset = options.getNumber('mode');
            const modetype = modetoset === 0 ? 'Off' : modetoset === 2 ? 'Repeat queue' : 'Repeat song';
            if (queue.repeatMode !== modetoset) {
                queue.setRepeatMode(modetoset)
                return await interaction.editReply({ embeds: [new EmbedBuilder().setColor('Random').setDescription(`Set repeat mode to \`${modetype}\``)] })
            } else {
                return await interaction.editReply({ embeds: [new EmbedBuilder().setColor('Red').setDescription(`Repeat mode is already set to \`${modetype}\` `)] })
            }

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
