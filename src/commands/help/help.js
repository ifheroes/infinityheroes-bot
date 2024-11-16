const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../data/config.json');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Zeigt dir, wie man neue Posts verfasst"),

        async execute(interaction) {
            const embed = new EmbedBuilder()
                .setTitle("Informationen bzgl. Verfassen von Posts")
                .setColor(color)
                .setDescription("Um einen neuen Post zu verfassen, nutzt man `/newpost`. Die verlangten Optionen müssen alle ausgefüllt werden. Für eine neue Zeile nutzt man `{nl}`.");
            await interaction.reply({ embeds: [embed], ephemeral: true });
        },
};
