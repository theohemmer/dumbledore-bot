require('dotenv').config();
const Dumbledore = require('./base/Dumbledore.js');
const express = require('express');
const path = require('path');
var cookieParser = require('cookie-parser');

const fs = require('fs');
const https = require('https');
const http = require('http');

var key = fs.readFileSync("/etc/letsencrypt/live/hemmer.dev/privkey.pem");
var cert = fs.readFileSync("/etc/letsencrypt/live/hemmer.dev/fullchain.pem");

var options = {key: key, cert: cert};

const { URL } = require('url');
const { ClientUser } = require('discord.js');
const { request } = require('http');

const webapp = express();
const port = 80;

const client = new Dumbledore();

client.addCommand("./commands/addpoint.js");

client.on('ready', () => {
    console.log('Bot ready!');
});

webapp.use(express.json());
webapp.use(express.urlencoded());
webapp.use(cookieParser());

client.on('message', message => {


    message.author.username;
    message.author.discriminator;
    message.author.id;

    if (message.content.startsWith('/db')) {
        const args = message.content.split(" ");

        const command = client.commands[args[1]];

        if (command !== undefined) {
            try {
                command.run(args, message);
            } catch (err) {console.error(err);}
        }
    }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);

webapp.enable('trust proxy');

webapp.use(function(req, res, next) {
    if (!req.secure) {
        return res.redirect("https://" + req.headers.host + req.url);
    }
    next();
});

webapp.use(express.static('html'));

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

authorizedTokens = new Array();

webapp.get('/addpoint', (req, res) => {
    if (req.cookies != undefined && req.cookies.session != undefined) {
        if (authorizedTokens.includes(req.cookies.session)) {
            res.sendFile(path.join(__dirname+'/html/addpoint_form.html'));
            return;
        } else {
            res.clearCookie('session');
            res.sendFile(path.join(__dirname+'/html/login_form.html'));
        }
    } else {
        res.sendFile(path.join(__dirname+'/html/login_form.html'));
        return;
    }
});

webapp.post('/addpoint', (req, res) => {
    if (req.cookies != undefined && req.cookies.session != undefined) {
        if (authorizedTokens.includes(req.cookies.session)) {
            try {
                const team = req.body.team;
                if (team != "red" && team != "green" && team != "yellow" && team != "blue") {
                    res.sendFile(path.join(__dirname+"html/error.html"));
                    return;
                }
                const point = parseInt(req.body.point);
                if (isNaN(point)) {
                    res.sendFile(path.join(__dirname+"html/error.html"));
                    return;
                }
                const reason = req.body.reason;
                client.addPoint(team, point, reason);
                res.redirect("/addpoint");
                return;
            } catch (err) {console.log(err);}
            res.sendFile(path.join(__dirname+'/html/error.html'));
            return;
        } else {
            res.clearCookie('session');
            sendFile(path.join(__dirname+'/html/login_form.html'));
        }
    } else {
        sendFile(path.join(__dirname+'/html/login_form.html'));
        return;
    }
});

webapp.post('/login', (req, res) => {
    try {
        if (req.body.password == "ECPool#2021-Dumbledore") {
            var session = makeid(32);
            res.cookie('session', session, {maxAge: 86400000 * 2});
            authorizedTokens.push(session);
            res.redirect("/addpoint");
            return;
        } else {
            res.sendFile(path.join(__dirname+'/html/bad_password.html'));
            return;
        }
    } catch(err) {console.log(err);}
    res.sendFile(path.join(__dirname+'/html/error.html'));
});

console.log("Application launched");

var serv = https.createServer(options, webapp);
var httpserv = http.createServer(webapp);

serv.listen(443, () => {
    console.log(`Server is running at https://127.0.0.1:443/`);
});

httpserv.listen(80, () => {
    console.log(`Server is running at https://127.0.0.1:80/`);
});

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
   return result;
}