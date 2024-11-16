const fs = require('fs');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token, mongodbURI } = require('./data/config.json');
const logger = require('silly-logger');
const { MongoClient } = require('mongodb');

logger.enableLogFiles(true);
logger.logFolderPath('./logs/');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.commands = new Collection();

const dbClient = new MongoClient(String(mongodbURI));
(async function dbSetup() {
	await dbClient.connect();
	client.dbClient = dbClient;
	logger.success('Connected to database server!');

	try {
		const databases = (await dbClient.db().admin().listDatabases()).databases;
		let found = false;
		databases.forEach((database) => {
			if (database.name === "ifheroes") found = true;
		});
		if (!found) {
			throw new Error("Database not existing!");
		}
	} catch (err) {
		logger.error("Database not existing! Please create a mongodb database called 'ifheroes' with a collection using any name and restart the bot!");
		process.exit(1);
	}

	const requiredCollections = ['ticket-configuration', 'tickets', 'stream'];
	const collections = await dbClient.db("ifheroes").listCollections().toArray();
	const collectionsOnServer = [];
	const notFound = [];

	collections.forEach((collection) => {
		collectionsOnServer.push(collection.name);
	});

	requiredCollections.forEach((collection) => {
		if (!collectionsOnServer.includes(collection)) notFound.push(collection);
	});

	if (notFound.length > 0) {
		logger.error(`Missing collections: ${notFound.join(', ')}`);
		logger.info("Creating missing collections...");
		notFound.forEach(async (collection) => {
			dbClient.db("ifheroes").createCollection(collection);
			logger.info(`Created collection ${collection}!`);
		});
	}
	logger.success("Database setup complete!\n");

} ());

client.storage = {
	newpost: {},
};

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
