const fs = require('fs');
const toml = require('toml');
const { Client, Intents } = require("discord.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});
const axios = require('axios');
const config = toml.parse(fs.readFileSync('./config.toml', 'utf-8'));
const prefix = config.prefix;
const token = config.token;

async function gode(text){
    const promise = axios.get(encodeURI(`https://api.guntxjakka.me/api/v1/getans?phrase=${text}`));
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;
}

client.on("ready", () => {
    client.user.setActivity("gode.app", { type: 'WATCHING'});
    console.log(`Logged in. I'm ${client.user.tag}!`);
});

client.on("messageCreate", message => {
    if (message.author.bot) return;

    if (message.content.includes("@here") || message.content.includes("@everyone")) return;
    
    if (message.type == 'REPLY' && message.mentions.has(client.user.id)){
        message.fetchReference()
        .then(originalMsg => {
            if (originalMsg.author.bot) return;
            let text = originalMsg.content;
            gode(text)
            .then(response => {
                console.log(`[${originalMsg.guild.name}] ${originalMsg.author.username} said: ${response.results}`);
                message.channel.send(`${originalMsg.author.username} said: ${response.results}`)})
            .catch(err => {
                message.channel.send("Error");
                console.log(err)});
        })
    }
        

    if (message.mentions.has(client.user.id) && message.type !== 'REPLY') {
        let mention = `<@!${client.user.id}>`;
        let args = message.content.slice(mention.length).trim().split(/ +/g);
        let text = args.join(" ")
        if (text !== ''){
            gode(text)
            .then(response => {
                let log = `[${message.guild.name}] ${message.author.tag} original: ${message.content} res: ${response.results}`
                console.log(log.replace(mention, '@bot'))
                message.channel.send(`Results: ${response.results}`)})
            .catch(err => {
                message.channel.send("Error");
                console.log(err)});
        }
        else {
            message.channel.send(`>>> **Command** \n **${prefix}gode** <text> \n returns converted phrase`);
        }

    } 

    if (message.content.indexOf(prefix) !== 0) return;
  
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === 'help'){
        message.channel.send(`>>> **Command** \n **${prefix}gode** <text> \n returns converted phrase`);
    }
    if(command === 'gode' || command === 'g;ode' || command === 'g'){
        let text = args.join(" ");
        if(text === ""){
            message.channel.send("Enter the text first!");
        } else {
            gode(text)
            .then(response => {
                let log = `[${message.guild.name}] ${message.author.tag} original: ${message.content} res: ${response.results}`
                console.log(log);
                message.channel.send(`Results: ${response.results}`)})
            .catch(err => {
                message.channel.send("Error");
                console.log(err)});
        }
    }
  });

client.login(token);