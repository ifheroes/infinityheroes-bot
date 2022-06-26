const { roleId } = require('../data/config.json');

module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction) {
		if (!interaction.isCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return;

        if (!interaction.guild) return await interaction.reply({ content: "No.", ephemeral: true });

        if (interaction.member.roles.resolve(roleId)) {
            try {
                await command.execute(interaction);
            }
            catch (error) {
                console.error(error);
                try {
                    await interaction.reply({ content: 'Es gab einen Fehler beim Ausführen des Commands!', ephemeral: true });
                }
                catch {
                    await interaction.editReply({ content: 'Es gab einen Fehler beim Ausführen des Commands!', ephemeral: true });
                }
            }
        } else {
            await interaction.reply({ content: 'Du darfst diesen Command nicht ausführen!', ephemeral: true });
        }
	},
};