const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    category: 'fun',
    data: new SlashCommandBuilder()
    .setName('babiify')
    .setDescription('CHANGES YOUR TEXT TOO LOOK LiiKE BABii')
    .addStringOption(option =>
        option.setName('input')
            .setDescription('iiNPUT TEXT TO CONVERT')
            .setRequired(true)),
    async execute(interaction) {
        const input = interaction.options.getString('input');

        const searchRegExp = /(?<!i)i(?!i)/gi;
        const searchRegExp2 = /I/g;
        const replaceWith = 'ii';
        const replaceWith2 = 'i';
        //set newMsg to string after command & shift to upper case
        let newMsg = input.toUpperCase();
        //replace any instances of single is with ii
        let newMsg2 = newMsg.replace(searchRegExp, replaceWith)
        //set any ignored is to lowercase
        let newMsg3 = newMsg2.replace(searchRegExp2, replaceWith2)
        interaction.reply(newMsg3);
    }
}
