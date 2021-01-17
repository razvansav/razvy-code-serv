const util = require('minecraft-server-util');
const Discord = require('discord.js');
const client = new Discord.Client();
client.login('NzY1NTU5MjMwNjg1MjQ5NTQ2.X4Wklw.p-fmUmYusJQRJvHTz5saLZxF9yU');

// IMPORTANT: You need to run "npm i minecraft-server-util@^3.0.1 discord.js@^12.3.1" (without quotes) in your terminal before executing this script

const server = {
    ip: 'V7D0X7.myserver.gs', // Put your minecraft server IP or hostname here (e.g. '192.168.0.1')
    port: 25565 // Put your minecraft server port here (25565 is the default)
};
const commands = {
    status: {
        command: '.status',
        text: {
            error: 'Error getting Minecraft server status...', // Check your terminal when you see this
            online: '**Minecraft** server is **online**  -  ',
            players: '**{online}** people are playing!', // {online} will show player count
            noPlayers: '**Nobody is playing**'
        }
        
    },
    
    }


// Do not edit below this line unless you know what you're doing

const cacheTime = 30 * 1000; // 30 sec cache time
let data, lastUpdated = 0;

client.on('message', message => { // Listen for messages and trigger commands
    if(message.content.trim() == commands.status.command) {
        statusCommand(message)
    } else if(message.content.trim() == commands.ip.command) {
        ipCommand(message)
    }
});

function statusCommand(message) { // Handle status command
    if(Date.now() > lastUpdated + cacheTime) { // Cache expired or doesn't exist
        util.status(server.ip, { port: server.port })
        .then(res => {
            data = res;
            lastUpdated = Date.now();
            replyStatus(message)
        })
        .catch(err => {
            console.error(err);
            return message.reply(commands.status.text.error);
        });
    } else { // Use cached data
        replyStatus(message)
    }
}

function replyStatus(message) {
    let { text } = commands.status;
    let status = text.online;
    status += data.onlinePlayers ? text.players : text.noPlayers;
    status = status.replace('{online}', data.onlinePlayers);
    message.reply(status);
}

function ipCommand(message) { // Handle IP command
    message.reply(commands.ip.text.main.replace('{ip}', server.ip).replace('{port}', server.port));
}

// Credit to The MG#8238 on Discord for improvements to this script
