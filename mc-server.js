const fetch = require('node-fetch');
const Discord = require('discord.js');
const client = new Discord.Client();
client.login('Your Token Here');

// IMPORTANT: You need to run "npm i node-fetch discord.js" (without quotes) in your terminal before executing this script

const server = {
    ip: '0.0.0.0', // Put your minecraft server IP or hostname here (e.g. '192.168.0.1')
    port: 25565 // Put your minecraft server port here (25565 is the default)
};
const commands = {
    status: {
        command: '.status',
        text: {
            error: 'Error getting Minecraft server status...', // Check your terminal when you see this
            offline: '*Minecraft server is currently offline*',
            online: '**Minecraft** server is **online**  -  ',
            players: '**{online}** people are playing!', // {online} will show player count
            noPlayers: '**Nobody is playing**'
        }
        
    },
    ip: {
        command: '.ip',
        text: {
            main: 'The IP for the server is `{ip}:{port}`' // {ip} and {port} will show server ip and port from above
        }
    }
};

// Do not edit below this line unless you know what you're doing

const url = 'https://mcapi.us/server/status?ip=' + server.ip + '&port=' + server.port;
const cacheTime = 5 * 60 * 1000; // 5 minute API cache time
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
        fetchStatus()
        .then(body => {
            if(body.status === 'success') return body;
            else throw body.error || 'unknown API error';
        })
        .then(body => {
            data = body;
            lastUpdated = body.last_updated * 1000 || Date.now();
            lastUpdated = Math.min(lastUpdate, Date.now()); // Last updated time can't be in the future
            lastUpdated = Math.max(lastUpdated, Date.now() - cacheTime + 60000); // Wait at least 1 minute
            replyStatus(message, data)
        })
        .catch(err => {
            console.error('Error:', err);
            return message.reply(commands.status.text.error);
        });
    } else { // Use cached data
        replyStatus(message)
    }
}

function replyStatus(message) {
    let { text } = commands.status;
    let status = text.offline;
    if(data.online) {
        status = text.online;
        status += data.players.now ? text.players : text.noPlayers;
        status = status.replace('{online}', data.players.now);
    }
    message.reply(status);
}

function fetchStatus() {
    return fetch(url)
        .then(res => {
            if(res.ok) return res;
            else throw res.statusText;
        })
        .then(res => res.json())
}

function ipCommand(message) { // Handle IP command
    message.reply(commands.ip.text.main.replace('{ip}', server.ip).replace('{port}', server.port));
}

// Credit to The MG#8238 on Discord for improvements to this script