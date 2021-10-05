const { Client, MessageEmbed, Collection } = require('discord.js');
const fs = require('fs');

module.exports = class Dumbledore extends Client {
    constructor() {
        super();
        this.accountsList = new Array();
        this.commands = new Array();
        this.linkedUsers = new Array();
        this.footer = "By: GamerArchitek#0063";
        this.pointsList = new Array();
        this.point_red = 0;
        this.point_yellow = 0;
        this.point_green = 0;
        this.point_blue = 0;
        try {
            let rawdata = fs.readFileSync("./all_points.json");
            let all_points = JSON.parse(rawdata);
            for (var i = 0; i < all_points.length; i++) {
                this.pointsList.push(all_points[i]);
                if (all_points[i].team == "red")
                    this.point_red += all_points[i].point;
                if (all_points[i].team == "blue")
                    this.point_blue += all_points[i].point;
                if (all_points[i].team == "yellow")
                    this.point_yellow += all_points[i].point;
                if (all_points[i].team == "green")
                    this.point_green += all_points[i].point;
            }
        } catch (err) {console.log(err)}
        this.last_point = null;
    }
    addCommand(fullPath) {
        try {
            const aCommand = new (require("../" + fullPath))(this);
            console.log(`Loading command ${fullPath}`);
            this.commands[aCommand.config.name] = aCommand;
            console.log(`Command ${aCommand.config.name} loaded`);
        } catch (e) {
            console.log(`Unable to load the command`);
            console.error(e);
        }
    }
    addPoint(team, point, reason) {
        var new_point = Object();
        if (team == "red" || team == "rouge" || team == "gryffondor" || team == "gryffindor") {
            team = "red";
            this.point_red += point;
        } else if (team == "yellow" || team == "jaune" || team == "poufsouffle" || team == "hufflepuff") {
            team = "yellow";
            this.point_yellow += point;
        } else if (team == "green" || team == "verte" || team == "serpentard" || team == "slytherin") {
            team = "green";
            this.point_green += point;
        } else if (team == "blue" || team == "bleu" || team == "serdaigle" || team == "ravenclaw") {
            team = "blue";
            this.point_blue += point;
        } else
            return;
        new_point.team = team;
        new_point.point = point;
        new_point.reason = reason;
        this.last_point = new_point;
        this.pointsList.push(new_point);
        let data = JSON.stringify(this.pointsList);
        fs.writeFileSync('./all_points.json', data);
    }
}