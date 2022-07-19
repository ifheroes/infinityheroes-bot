const fs = require('fs');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./data/config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages] });
client.commands = new Collection();

const folders = fs.readdirSync('./src/commands');

for (const folder of folders) {
    const files = fs.readdirSync(`./src/commands/${folder}`);
    for (const file of files) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.data.name, command);
    }
}

const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);