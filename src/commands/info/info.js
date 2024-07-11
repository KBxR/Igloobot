const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const command = new SlashCommandBuilder()
    .setName('info')
    .setDescription('Information about Creatures, Places, and Things in the world of Iglooghost')
    .addStringOption(option =>
        option.setName('search')
            .setDescription('Search for a Creature, Place, or Thing')
            .setRequired(true)
            .setAutocomplete(true));

async function fetchSuggestions(query) {
    const allOptions = ["neowaxbloom","solarchurch","iglooghost","lummo","melonlanterngirlschoir","mogu","nama","neogumflower","tamei","usohachi","xiangjiao","yomi","auo","daosingrods","guao","newsylph","chinesenuyr","cleartameisteelmogu","littlegrids","heliocene","paleo","amulang","ancientsymbols","mamunese","xaoese","blackmoreveil","bodminmoor","memmabay","moorlands","gridgod","chinchou","eoesong","goldcoat","goldtea","meimodesong","mlgcsong","peanutchoker","shrinehacker","solarblade","whitegum","xiangjiaosong","yomisuite","amu","eye","monk","witch","worm","xao","yemmo","amusummoning","eoe","ms2001","ancienthymn","leimusic","meimode","solarbladeattack","clunkingbody","meru","oau","plu","wu","amuearth","mamu","meruworld","xaovoidcity"];
    return allOptions.filter(option => option.toLowerCase().includes(query.toLowerCase()));
}

command.autocomplete = async (interaction) => {
    if (!interaction.isAutocomplete()) return;

    const focusedOption = interaction.options.getFocused(true);
    if (focusedOption.name === 'search') {
        const suggestions = await fetchSuggestions(focusedOption.value);
        const choices = suggestions.map(choice => ({ name: choice, value: choice }));
        await interaction.respond(choices.slice(0, 25)); // Respond with up to 25 suggestions
    }
};

// Load embeds data from JSON
const embedsDataPath = path.join(__dirname, 'embedsData.json');
const embedsData = JSON.parse(fs.readFileSync(embedsDataPath, 'utf8'));

module.exports = {
    data: command,
    execute: async (interaction) => {
        const searchQuery = interaction.options.getString('search');
        const embedInfo = embedsData[searchQuery];

        if (!embedInfo) {
            await interaction.reply({ content: 'No information found for your search.', ephemeral: true });
            return;
        }

        const embed = new EmbedBuilder()
            .setAuthor({name: embedInfo.author.name, iconURL: embedInfo.author.iconURL})
            .setTitle(embedInfo.title)
            .setDescription(embedInfo.description)
            .setURL(embedInfo.url)
            .setImage(embedInfo.img)
            .setColor(embedInfo.color);
            
        if (embedInfo.fields) {
            embedInfo.fields.forEach(field => {
                embed.addFields({ name: field.name, value: field.value, inline: field.inline ?? false });
            });
        }

        await interaction.reply({ embeds: [embed] });
    },
    autocomplete: command.autocomplete
};