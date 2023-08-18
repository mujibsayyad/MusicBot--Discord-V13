const { Client } = require("discord.js");
const { loadFiles } = require("../functions/loadfiles");

/**
 * 
 * @param {Client} client client bind 
 */
module.exports = async (client) => {

    const events = new Array();
    
    const files = await loadFiles('events');
    for (const file of files) {
        try {
            const event = require(file);
            const execute = (...args) => event.execute(...args, client);
            const target = event.rest ? client.rest : client;
            target[event.once ? 'once' : 'on'](event.name, execute);
            client.events.set(event.name, execute);

            events.push({ Events: event.name, Status: '☑️' });
        } catch (error) {
            events.push({ Events: file.split('/').pop().slice(0, -3), Status: '✖️' });
        }
    }

    console.table(events, ['Events', 'Status']);
}