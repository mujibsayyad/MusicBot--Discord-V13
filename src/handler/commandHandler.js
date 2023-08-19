const { Client, REST, Routes } = require("discord.js");
const { loadFiles } = require("../functions/loadfiles");
require('dotenv/config');
/**
 * 
 * @param {Client} client client bind 
 */
module.exports = async (client) => {
    const files = await loadFiles('src/commands');
    const SlashCommands = [];
    const cmdtable = [];

    for (const file of files) {

        const command = await require(file);
        // if (!command?.data?.name) return cmdtable.push({ Command: `${file.match(/[\w\s\-]+\.\w+$/)}`, Status: '✖️', Error: `${file.match(/[\w\s\-]+\.\w+$/)} Missing a name ( name must be lowercase )` });

        // if (!command?.execute) return cmdtable.push({ Command: `${command.name}`, Status: '✖️', Error: `${file.match(/[\w\s\-]+\.\w+$/)} Missing a execute function or if u have different name change it to run ` });

        client.commands.set(command.data.name, command);
        SlashCommands.push(command.data.toJSON());
        cmdtable.push({ Command: command.data.name, Status: '☑️' });
    }

    console.table(cmdtable, ['Command', 'Status']);
    console.log(`${SlashCommands.length}  Commands loaded `);
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        if (process.env.PRIVATEGUILD) {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENTID, process.env.PRIVATEGUILD),
                { body: SlashCommands },
            );
        } else {
            await rest.put(
                Routes.applicationCommands(process.env.CLIENTID),
                { body: SlashCommands },
            );
        }
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }


}