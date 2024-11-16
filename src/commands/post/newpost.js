const { SlashCommandBuilder } = require('@discordjs/builders');
const { botAdminRole } = require('../../data/config.json');
const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("newpost")
		.setDescription("Erstelle einen neuen Post auf dem Discord und der Website")
		.addChannelOption(option =>
			option
				.setName("channel")
				.setDescription("Channel, in dem der Post erstellt werden soll.")
				.setRequired(true))
		.addRoleOption(option =>
			option
				.setName("ping")
				.setDescription("Rolle, die gepingt werden soll")
				.setRequired(false))
		.setDMPermission(false),

	async execute(interaction) {
		if (!interaction.member.roles.cache.has(botAdminRole)) return await interaction.reply({ ephemeral: true, content: "Du hast keine Berechtigung, diesen Command auszuführen!" });

		const modal = new ModalBuilder()
			.setCustomId(`newpost_${interaction.user.id}`)
			.setTitle("Neuer Post");

		const channel = await interaction.guild.channels.fetch(interaction.options.getChannel("channel").id);
		const ping = interaction.options.getRole("ping") || undefined;

		const titleInput = new TextInputBuilder()
			.setCustomId("postTitle")
			.setLabel("Titel vom Post")
			.setStyle(TextInputStyle.Short)
			.setRequired(true);

		const textInput = new TextInputBuilder()
			.setCustomId("postText")
			.setLabel("Text vom Post")
			.setStyle(TextInputStyle.Paragraph)
			.setRequired(true);

		const imageInput = new TextInputBuilder()
			.setCustomId("postImage")
			.setLabel("Direkte URL vom Bild")
			.setStyle(TextInputStyle.Short)
			.setRequired(false);

		const titleActionRow = new ActionRowBuilder().addComponents(titleInput);
		const textActionRow = new ActionRowBuilder().addComponents(textInput);
		const imageActionRow = new ActionRowBuilder().addComponents(imageInput);

		modal.addComponents(titleActionRow, textActionRow, imageActionRow);

		interaction.client.storage.newpost[interaction.user.id] = {
			channel: channel.id,
			ping: ping,
		};

		await interaction.showModal(modal);
	},
};
