const Command = require("../base/Command.js");
const { MessageEmbed } = require("discord.js")

module.exports = class BuildInfoCommand extends Command {

    constructor(client) {
        super(client, {
            name: "addpoint",
            help_message: "/db addpoint <team> <point> <raison>: add point to team"
        });
    }

    run(args, message)
    {
        if (args.length >= 5) {
            team = args[2];
            team = team.toLowerCase();
            if (team != "red" || team != "yellow" || team != "green" || team != "blue"
            || team != "rouge" || team != "jaune" || team != "verte" || team != "bleu"
            || team != "gryffondor" || team != "poufsouffle" || team != "serpentard" || team != "serdaigle"
            || team != "gryffindor" || team != "hufflepuff" || team != "slytherin" || team != "ravenclaw") {
                const embed_wait = new MessageEmbed()
                    .setTitle(`The team is invalid, possible value are: \`red, rouge, gryffondor, gryffindor\`, \`yellow, jaune, poufsouffle, hufflepuff\`, \`green, verte, serpentard, slytherin\`, \`blue, bleu, serdaigle, ravenclaw\``)
                    .setColor(0xff0000)
                    .setFooter(this.client.footer);
                message.channel.send(embed_wait);
            }
            const point = parseInt(args[3]);
            if (isNaN(point)) {
                const embed_wait = new MessageEmbed()
                    .setTitle(`The number of point is invalid`)
                    .setColor(0xff0000)
                    .setFooter(this.client.footer);
                message.channel.send(embed_wait);
            }
            reason = message.content.substring(message.content.indexOf(args[3]) + args[3].length);
            const embed_wait = new MessageEmbed()
                .setTitle(`Added ${point} to team ${team}.`)
                .setColor(0xff6600)
                .setFooter(this.client.footer);
            message.channel.send(embed_wait);
            client.addPoint(team, point, reason);
        }
    }

}