const fs = require('fs');
const toml = require('toml');
const { Client, Events, GatewayIntentBits, ActivityType, MessageType } = require('discord.js');
const godejs = require('gode.js')
const client = new Client({
    intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});
const config = toml.parse(fs.readFileSync('./config.toml', 'utf-8'));
const prefix = config.prefix;
const token = config.token;

function gode(text) {
    return godejs.convert("QWERTY", "Kedmanee", text)
}

client.on(Events.ClientReady, (c) => {
    client.user.setPresence({
		activities: [{name: "gode.app", type: ActivityType.Watching}],
		status: 'available'
	});
    console.log(`Logged in. I'm ${client.user.tag}!`);
});

client.on(Events.MessageCreate, message => {
    if (message.author.bot) return;

    if (message.content.includes("@here") || message.content.includes("@everyone")) return;

    if (message.type == MessageType.Reply && message.mentions.has(client.user.id)) {
        message.fetchReference()
            .then(originalMsg => {
                if (originalMsg.author.bot) return;
                let text = originalMsg.content;
                let ans = gode(text)
                try{
                    console.log(`[${originalMsg.guild.name}] ${originalMsg.author.username} said: ${ans}`);
                    message.channel.send(`${originalMsg.author.username} said: ${ans}`)
                }
                catch {
                    message.reply("Error");
                }
            })
    }


    if (message.mentions.has(client.user.id) && message.type !== MessageType.Reply) {
        let mention = `<@!${client.user.id}>`;
        let args = message.content.slice(mention.length).trim().split(/ +/g);
        let text = args.join(" ")
        if (text !== '') {
            let ans = gode(text)
            let log = `[${message.guild.name}] ${message.author.tag} original: ${message.content} res: ${ans}`
            console.log(log.replace(mention, '@bot'))
            message.reply(`Results: ${ans}`)
        }
        else {
            message.reply(`>>> **Command** \n **${prefix}gode** <text> \n returns converted phrase`);
        }

    }

    if (message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === 'help') {
        message.reply(`>>> **Command** \n **${prefix}gode** <text> \n returns converted phrase`);
    }
    if (command === 'gode' || command === 'g;ode' || command === 'g') {
        let text = args.join(" ");
        if (text === "") {
            message.reply("Enter the text first!");
        } else {
            let ans = gode(text)
            let log = `[${message.guild.name}] ${message.author.tag} original: ${message.content} res: ${ans}`
            console.log(log)
            message.reply(`Results: ${ans}`)
        }
    }
});

client.login(token);