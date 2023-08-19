const { Client, Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
     *
     * @param {Client} client client acccess
     */
    async execute(client) {

        console.log(`Logged in as ${client.user.tag}`);

    }
};