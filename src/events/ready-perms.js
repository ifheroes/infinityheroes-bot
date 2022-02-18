const { guildId, roleId } = require('../data/config.json');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		const permissions = [
			{
				id: roleId,
				type: 'ROLE',
				permission: true,
			},
		];

		const guild = await client.guilds.fetch(guildId);
		const commands = await guild.commands.fetch();
		commands.forEach(async command => {
			command.permissions.set({ permissions });
		});
		console.log("Successfully updated Guild Command Permissions!\n");
	},
};