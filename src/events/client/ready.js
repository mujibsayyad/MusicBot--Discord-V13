const { Client, Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
     *
     * @param {Client} client client acccess
     */
    async execute(client) {

        client.user.setActivity({ name: 'Your Songs', type: 'PLAYING' });
        console.log(`Logged in as ${client.user.tag}`);
    }
};