const fs = require('fs');
const toml = require('toml');
const { Client, Intents } = require("discord.js");
const godejs = require('gode.js')
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});
const config = toml.parse(fs.readFileSync('./config.toml', 'utf-8'));
const prefix = config.prefix;
const token = config.token;

function gode(text) {
    let ans = godejs.convert("QWERTY", "Kedmanee", message)
    return ans
}

client.on("ready", () => {
    client.user.setActivity("gode.app", { type: 'WATCHING' });
    console.log(`Logged in. I'm ${client.user.tag}!`);
});

client.on("messageCreate", message => {
    if (message.author.bot) return;

    if (message.content.includes("@here") || message.content.includes("@everyone")) return;

    if (message.type == 'REPLY' && message.mentions.has(client.user.id)) {
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
                    message.channel.send("Error");
                }
            })
    }


    if (message.mentions.has(client.user.id) && message.type !== 'REPLY') {
        let mention = `<@!${client.user.id}>`;
        let args = message.content.slice(mention.length).trim().split(/ +/g);
        let text = args.join(" ")
        if (text !== '') {
            let ans = gode(text)
            let log = `[${message.guild.name}] ${message.author.tag} original: ${message.content} res: ${ans}`
            console.log(log.replace(mention, '@bot'))
            message.channel.send(`Results: ${ans}`)
        }
        else {
            message.channel.send(`>>> **Command** \n **${prefix}gode** <text> \n returns converted phrase`);
        }

    }

    if (message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === 'help') {
        message.channel.send(`>>> **Command** \n **${prefix}gode** <text> \n returns converted phrase`);
    }
    if (command === 'gode' || command === 'g;ode' || command === 'g') {
        let text = args.join(" ");
        if (text === "") {
            message.channel.send("Enter the text first!");
        } else {
            let ans = gode(text)
            let log = `[${message.guild.name}] ${message.author.tag} original: ${message.content} res: ${ans}`
            console.log(log)
            message.channel.send(`Results: ${ans}`)
        }
    }
});

client.login(token);