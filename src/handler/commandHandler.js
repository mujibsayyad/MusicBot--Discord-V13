const { Client } = require("discord.js");
const { loadFiles } = require("../functions/loadfiles");

/**
 * 
 * @param {Client} client client bind 
 */
module.exports = async (client) => {

    const files = await loadFiles('commands');
    const SlashCommands = [];
    const cmdtable = [];
    for (const file of files) {

        const command = require(file);
        if (!command?.data?.name) return cmdtable.push({ Command: `${file.match(/[\w\s\-]+\.\w+$/)}`, Status: '✖️', Error: `${file.match(/[\w\s\-]+\.\w+$/)} Missing a name ( name must be lowercase )` });

        if (!command?.run) return cmdtable.push({ Command: `${command.name}`, Status: '✖️', Error: `${file.match(/[\w\s\-]+\.\w+$/)} Missing a execute function or if u have different name change it to run ` });

        client.commands.set(command.data.name, command);
        SlashCommands.push(command.data.toJSON());
        cmdtable.push({ Command: command.data.name, Status: '☑️' });
    }

    if (client.config.PRIVATEGUILD) {

    } else {

    }

    console.table(SlashCommands, ['Commands', 'Status','Error']);
    console.log(`${SlashCommands.length}  Commands loaded `);

}