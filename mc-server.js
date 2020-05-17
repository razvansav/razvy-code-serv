const Discord = require('discord.js');
const client = new Discord.Client();
client.login('Your Token Here');
const request = require('request');
const config = {
    commands: {
        status: {
            command: ".status",
            messages: {
                error: "Error getting Minecraft server status...",
                offline: "*Minecraft server is currently offline*",
                online: "**Minecraft** server is **online**  -  ",
                players: "**{online}** people are playing!",
                noPlayers: "**Nobody is playing**"
            }
            
        },
        ip: {
            command: ".ip",
            messages: {
                main: "the ip for the server ex: 0.0.0.0:25565"
            }
        }
    },
    server: {
        ip: "0.0.0.0", //ip for server
        port: 25565 //port 
    }
};

// IMPORTANT: You need to run "npm install request" (without quotes) in your terminal before executing this script

client.on('message', message => {
    if (message.content === config.commands.status.command) {
        let url = 'http://mcapi.us/server/status?ip=' + config.server.ip + '&port=' + config.server.port;
        request(url, function(err, response, body) {
            if(err) {
                console.error(err);
                return message.reply(config.commands.status.messages.error);
            }
            body = JSON.parse(body);
            var status = config.commands.status.messages.offline;
            if (body.online) {
                status = config.commands.status.messages.online;
                body.players.now ? status += config.commands.status.messages.players : status += config.commands.status.messages.noPlayers;
                status.replace("{online}", body.players.now);
            }
            message.reply(status);
        });
    }
    else if (message.content === config.commands.ip.command) {
        message.reply(config.commands.ip.messages.main);
    }
});