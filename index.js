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
    const promise = axios.get(`https://api.guntxjakka.me/api/v1/getans?phrase=${text}`);
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;
}

client.on("ready", () => {
    client.user.setActivity("gode.app", { type: 'WATCHING'});
    console.log(`Logged in. I'm ${client.user.tag}!`);
});

client.on("messageCreate", message => {
    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return;
  
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === 'help'){
        message.channel.send(">>> **Command** \n - **gode** <text> \n returns converted phrase");
    }
    if(command === 'gode'){
        let text = args.join(" ");
        if(text === ""){
            message.channel.send("Enter the text first!");
        } else {
            gode(text)
            .then(response => {
                message.channel.send(`Results: ${response.results}`)})
            .catch(err => {
                message.channel.send("Error");
                console.log(err)});
        }
    }
  });

client.login(token);