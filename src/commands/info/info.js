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
    const allOptions = ["neo_wax_bloom","solar_church","iglooghost","lummo","melon_lantern_girls_choir","mogu","nama","neo_gum_flower","tamei","usohachi","xiangjiao","yomi","auo","daosing_rods","guao","new_sylph","chinese_nu_yr","clear_tamei__steel_mogu","little_grids","heliocene","paleo","amu_lang","ancient_symbols","mamunese","xaoese","blackmore_veil","bodmin_moor","memma_bay","moorlands","grid_god","chinchou","eoe_song","gold_coat","gold_tea","mei_mode_song","melon_lantern_girls_choir_song","peanut_choker","shrine_hacker","solar_blade","white_gum","xiangjiao_song","yomi_suite","amu","eye","monk","witch","worm","xao","yemmo","amu_summoning","eoe","millennium_summoning_2001","ancient_hymn","lei_music","mei_mode","solar_blade_attack","clunking_body","meru","oau","plu","wu","amu_earth","mamu","meru_world","xao_void_city"];
    return allOptions.filter(option => option.toLowerCase().includes(query.toLowerCase()));
}

command.autocomplete = async (interaction) => {
    if (!interaction.isAutocomplete()) return;

    const focusedOption = interaction.options.getFocused(true);
    if (focusedOption.name === 'search') {
        const suggestions = await fetchSuggestions(focusedOption.value);
        // Format choices for display and selection
        const choices = suggestions.map(choice => {
            // Replace "__" with "/" then "_" with " ", and capitalize the first letter of each word
            const displayName = choice
                .replace(/__/g, '/')
                .replace(/_/g, ' ')
                .toLowerCase()
                .replace(/\b\w/g, l => l.toUpperCase());
            // Use a lowercase, space-less version for the value
            const valueName = choice.toLowerCase().replace(/\s+/g, '');
            return { name: displayName, value: valueName };
        });
        await interaction.respond(choices.slice(0, 25)); // Respond with up to 25 suggestions
    }
};

// Load embeds data from JSON
const embedsDataPath = path.join(__dirname, 'embedsData.json');
const embedsData = JSON.parse(fs.readFileSync(embedsDataPath, 'utf8'));

module.exports = {
    data: command,
    execute: async (interaction) => {
        // Allowed channel IDs
        const allowedChannelIds = ['696398152730673232', '624761097936830488'];
    
        // Check if the command is used in an allowed channel
        if (!allowedChannelIds.includes(interaction.channelId)) {
            await interaction.reply({ content: 'This command cannot be used here.', ephemeral: true });
            return;
        }
    
        const searchQuery = interaction.options.getString('search');
        const embedInfo = embedsData[searchQuery];
    
        if (!embedInfo) {
            await interaction.reply({ content: 'No information found for your search.', ephemeral: true });
            return;
        }
    
        const embed = new EmbedBuilder()
            .setAuthor({name: embedInfo.author.name, iconURL: embedInfo.author.iconURL})
            .setTitle(embedInfo.title)
            .setURL(embedInfo.url)
            .setImage(embedInfo.image)
            .setColor(embedInfo.color);
            
        if (embedInfo.description) {
            embed.setDescription(embedInfo.description);
        }
        
        if (embedInfo.fields) {
            embedInfo.fields.forEach(field => {
                embed.addFields({ name: field.name, value: field.value, inline: field.inline ?? false });
            });
        }
    
        await interaction.reply({ embeds: [embed] });
    },
    autocomplete: command.autocomplete
};