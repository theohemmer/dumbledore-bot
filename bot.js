require('dotenv').config();
const Dumbledore = require('./base/Dumbledore.js');
const express = require('express');

const { URL } = require('url');
const { ClientUser } = require('discord.js');

const webapp = express();
const port = 80;

const client = new Dumbledore();

client.addCommand("./commands/addpoint.js");

client.on('ready', () => {
    console.log('Bot ready!');
});

client.on('message', message => {
    if (!message.guild) return;

    if (message.content.startsWith('/db')) {
        const args = message.content.split(" ");

        const command = client.commands[args[1]];

        if (command !== undefined) {
            try {
                console.log (command);
                command.run(args, message);
            } catch (err) {console.error(err);}
        }
    }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);

webapp.use(express.static('html'));

webapp.listen(port, () => {
    console.log(`Server is running at https://127.0.0.1:${port}/`);
});

webapp.get('/getpoint', (req, res) => {
    var obj = new Object();
    obj.red = client.point_red;
    obj.green = client.point_green;
    obj.yellow = client.point_yellow;
    obj.blue = client.point_blue;
    var jsonstring = JSON.stringify(obj);
    var json = JSON.parse(jsonstring);
    res.setHeader('content-type', 'application/json');
    res.send(json);
});

webapp.get('/notif', (req, res) => {
    var obj = new Object();
    if (client.last_point != null) {
        obj.type = "notif";
        obj.team = client.last_point.team;
        obj.reason = client.last_point.reason;
        obj.point = client.last_point.point;
        client.last_point = null;
    } else {
        obj.type = "nothing";
    }
    var jsonstring = JSON.stringify(obj);
    var json = JSON.parse(jsonstring);
    res.setHeader('content-type', 'application/json');
    res.send(json);
});

client.addPoint("blue", 20, "Ils sont beau :)");
client.addPoint("yellow", 15, "Ils sont beau :)");
client.addPoint("red", -1, "Ils sont beau :)");
client.addPoint("green", 5, "Ils sont beau :)");

console.log("Application launched");