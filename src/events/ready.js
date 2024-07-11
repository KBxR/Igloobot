const { Events, ActivityType } = require('discord.js');
const { activities } = require('@utils/activity.json');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        try {
            // Set the bots activity
            const randomActivity = activities[Math.floor(Math.random() * activities.length)];
            client.user.setActivity(randomActivity, { type: ActivityType.Listening });

            console.log(`Ready! Logged in as ${client.user.tag}`);
        } catch (error) {
            console.error('Error setting bot status:', error);
        }

        // Activity Loop
        setInterval(() => {
            const randomActivity = activities[Math.floor(Math.random() * activities.length)];
            client.user.setActivity(randomActivity, { type: ActivityType.Listening });
        }, 1800000); 
    },
};