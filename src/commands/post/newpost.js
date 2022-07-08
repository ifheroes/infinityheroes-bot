const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
		.setName("newpost")
		.setDescription("Erstelle einen neuen Post auf der Website")
		.addStringOption(option =>
			option
				.setName("titel")
				.setDescription("Der Titel vom Post")
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName("text")
				.setDescription("Fließtext der im Post stehen soll. Neue Zeilen werden mit '{nl}' angefangen")
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName("bild")
				.setDescription("Direkte URL vom Bild")
				.setRequired(true)),

		async execute(interaction) {
			await interaction.deferReply();
			const author = interaction.user;
			const title = interaction.options.getString("titel");
			const text = interaction.options.getString("text");
			const image = interaction.options.getString("bild");
			const newText = text.replace(/({nl})/gm, "\n");

			let json = {
				"title": title,
				"text": newText,
				"image": image,
			};
			json = JSON.stringify(json, null, 4);

			const date = moment().format("MM-DD-YYYY_HH-mm-ss");

			fs.writeFile(`./exports/${date}.json`, json, 'utf-8', function writeFileCallback(err) {
				if (err) { console.log(err); }
			});

			const embed = new MessageEmbed()
				.setTitle(title)
				.setColor(color)
				.setDescription(newText)
				.setImage(image)
				.setAuthor({ name: author.username, iconURL: author.displayAvatarURL({ dynamic: true }) });
			await interaction.editReply({ embeds: [embed] });
		},
};