const logger = require('silly-logger');

module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return;

        if (!interaction.guild) return await interaction.reply({ content: "No.", ephemeral: true });

		try {
			await command.execute(interaction);
		} catch (error) {
			logger.error(error);
			try {
				await interaction.reply({ content: 'Es gab einen Fehler beim Ausführen des Commands!', ephemeral: true });
			} catch {
				await interaction.editReply({ content: 'Es gab einen Fehler beim Ausführen des Commands!', ephemeral: true });
			}
		}
	},
};
