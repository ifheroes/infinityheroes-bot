const logger = require('silly-logger');
const { EmbedBuilder } = require('discord.js');
const { color } = require('../data/config.json');
const fs = require('fs');
const moment = require('moment');
const ConvertImageToBase64 = require("../Utils/CovertImageToBase64");

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (!interaction.isModalSubmit()) return;

        if (interaction.customId.startsWith("newpost_")) {
            await interaction.deferReply({ ephemeral: true });
            await interaction.editReply({ content: "Post wird erstellt...", ephemeral: true });
            const authorId = interaction.customId.split("_")[1];
            const additionalData = interaction.client.storage.newpost[authorId] || null;
            if (!additionalData) {
                return await interaction.editReply({
                    content: "Es ist ein Fehler aufgetreten!\nBitte versuche es erneut.",
                    ephemeral: true,
                });
            }

            const data = {
                title: interaction.fields.getTextInputValue("postTitle"),
                text: interaction.fields.getTextInputValue("postText"),
                image: interaction.fields.getTextInputValue("postImage"),
                channel: additionalData.channel,
                ping: additionalData.ping,
            };

            delete interaction.client.storage.newpost[authorId];

            const channel = await interaction.guild.channels.fetch(data.channel);
            if (!channel.isTextBased()) {
                return await interaction.editReply({
                    content: "Der angegebene Channel ist kein Textkanal!",
                    ephemeral: true,
                });
            }

            const embed = new EmbedBuilder()
                .setTitle(data.title)
                .setDescription(data.text)
                .setColor(color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            if (data.image) {
                embed.setImage(data.image);
            }

            const imageData = await ConvertImageToBase64("https://media.discordapp.net/attachments/1170799164171489291/1292106316646584435/image.png?ex=673d3208&is=673be088&hm=e4ff0ede05fd3a196e47a0bbe24950cecb6231422f82c2a240933ee989e43acf");

            let json = {
                "author": {
                    "name": interaction.user.tag,
                    "iconURL": interaction.user.displayAvatarURL(),
                },
                "title": data.title,
                "text": data.text,
                "image": {
                    "mime": imageData.mimeData,
                    "data": imageData.base64Data,
                },
            };

            json = JSON.stringify(json, null, 4);
            const date = moment().format("YYYY-MM-DD_HH-mm-ss");

            try {
                fs.writeFile(`./exports/${date}.json`, json, 'utf-8', async function writeFileCallback(err) {
                    if (err) {
                        logger.error(err);
                        return await interaction.user.send({ content: 'Es gab einen Fehler beim Erstellen des Posts. Er konnte nicht exportiert werden!\nBitte versuch es erneut!' });
                    }
                });

                await channel.send({
                    content: data.ping ? (data.ping.name == "@everyone" ? "@everyone" : `<@&${data.ping.id}>`) : "",
                    embeds: [embed],
                });
            } catch (error) {
                logger.error(error);
                return await interaction.user.send({ content: 'Es gab einen Fehler beim Erstellen des Posts. Vermutlich konnte er nicht in den Channel gepostet werden!\nBitte versuch es erneut!' });
            }

            return logger.info("Created post successfully!");
        }

        if (!interaction.guild) return;
    },
};
