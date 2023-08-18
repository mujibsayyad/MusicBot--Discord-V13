/* eslint-disable no-process-env */
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { DisTube } = require('distube');
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, ThreadMember, Message, GuildMember } = Partials;

require('dotenv/config');
const config = {
    TOKEN: process.env.TOKEN,
    PRIVATEGUILD: process.env.PRIVATEGUILD ? process.env.PRIVATEGUILD : null,
    CLIENTID: process.env.CLIENTID ? process.env.CLIENTID : null,
};

const client = new Client({
    intents: [
        Guilds,
        GuildMembers,
        GuildMessages,
    ],
    partials: [
        User,
        Message,
        GuildMember,
        ThreadMember
    ]
});


client.commands = new Collection();
client.events = new Map();
client.config = config;

const player = new DisTube(client, {
    emptyCooldown: 1000 * 60,
    leaveOnEmpty: true,
    leaveOnFinish: true,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [
        new SpotifyPlugin({
            emitEventsAfterFetching: true
        }),
        new YtDlpPlugin()
    ]
});

client.player = player;





require('./handler/eventHandler')(client);
client.login(config.TOKEN)
    .then(() => {
        require('./handler/commandHandler')(client);
    })
    .catch((err) => {
        console.log(err)
    });