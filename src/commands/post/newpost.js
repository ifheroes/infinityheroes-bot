const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');
const fs = require('fs');
const moment = require('moment');

const { color } = require('../../data/config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("newpost")
		.setDescription("Erstelle einen neuen Post auf der Website"),
	async execute(interaction, client) {
		let newPostModal = new ModalBuilder()
			.setTitle("Erstelle einen neuen Post!")
			.setCustomId("newPostModalSubmit");

		let embedTitle = new TextInputBuilder()
			.setCustomId("embedTitle")
			.setLabel("Titel")
			.setPlaceholder("Neues Upda..")
			.setStyle(TextInputStyle.Short)
			.setRequired(true);

		let embedDescription = new TextInputBuilder()
			.setCustomId("embedDescription")
			.setLabel("Beschreibung")
			.setPlaceholder("Die neuen Fea..")
			.setStyle(TextInputStyle.Paragraph)
			.setRequired(true);

		let embedImage = new TextInputBuilder()
			.setCustomId("embedImage")
			.setLabel("Thumbnail")
			.setPlaceholder("https://i.imgur.com/...")
			.setStyle(TextInputStyle.Short)
			.setRequired(true);

		let embedTitleRow = new ActionRowBuilder()
			.addComponents(embedTitle);
		let embedDescriptionRow = new ActionRowBuilder()
			.addComponents(embedDescription);
		let embedImageRow = new ActionRowBuilder()
			.addComponents(embedImage);

		newPostModal.addComponents(embedTitleRow, embedDescriptionRow, embedImageRow);

		await interaction.showModal(newPostModal);

		await client.once("interactionCreate", async (interaction) => {
			if (!interaction.isModalSubmit() &&
				!interaction.customId === "newPostModalSubmit") return;

			let embedTitle = interaction.fields.getTextInputValue("embedTitle");
			let embedDescription = interaction.fields.getTextInputValue("embedDescription");
			let embedImage = interaction.fields.getTextInputValue("embedImage");

			let createdMessage = new EmbedBuilder()
				.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
				.setTitle(embedTitle)
				.setDescription(embedDescription)
				.setColor(color)
				.setImage(embedImage);

			let messageJson = {
				"title": embedTitle,
				"text": embedDescription,
				"image": embedImage,
			};

			messageJson = JSON.stringify(messageJson, null, 4);

			let date = moment().format("MM-DD-YYYY_HH-mm-ss");

			fs.writeFile(`./exports/${date}.json`, messageJson, 'utf-8', function writeFileCallback(err) {
				if (err) console.log(err);
			});

			interaction.reply({ embeds: [createdMessage] })
		});
	},
};