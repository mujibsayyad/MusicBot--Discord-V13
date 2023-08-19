/* eslint-disable no-process-env */
const { SpotifyPlugin } = require('@distube/spotify');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { ExtractorPlugin } = require('distube');
const { DisTube } = require('distube');
const { Guilds,GuildVoiceStates, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, ThreadMember, Message, GuildMember } = Partials;

require('dotenv/config');
const client = new Client({
    intents: [
        Guilds,
        GuildMembers,
        GuildMessages,
        GuildVoiceStates
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
        new ExtractorPlugin(),
        new YtDlpPlugin()
    ]
});

client.player = player;




require('./handler/eventHandler')(client);
require('./handler/distubeeventshandler')(client,player)
client.login(process.env.TOKEN)
    .then(() => {
        require('./handler/commandHandler')(client);
    })
    .catch((err) => {
        console.log(err)
    });

module.exports = { player }