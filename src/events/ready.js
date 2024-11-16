const logger = require('silly-logger');
const { ActivityType } = require('discord.js');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		logger.success(`Ready! Logged in as ${client.user.tag}`);
		client.user.setActivity(`ifheroes.de`, { type: ActivityType.Playing });
	},
};
