const { Client, EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Sent bot ping info and latency')
        .setDMPermission(false),

    /**
     * @param {ChatInputCommandInteraction} interaction intractions
     * @param {client} client client
     * @param {EmbedBuilder} EmbedBuilder embed bind
     */
    async run(interaction) {
        interaction.deferReply();
        
        try {
            // const voiceChannel = message.member?.voice?.channel;
            // 		if (voiceChannel) {
            // 			distube.play(voiceChannel, args.join(' '), {
            // 				message,
            // 				textChannel: message.channel,
            // 				member: message.member,
            // 			});
            // 		} else {
            // 			message.channel.send(
            // 				'You must join a voice channel first.',
            // 			);
            // 		}



            interaction.editReply({ embeds: [playembed] });

            // let asume this is warn cmd 


        } catch (error) {
            console.log(error);
        }
    }
};


