const { iglooghostInfo } = require('@database/models');

class DBHandler {
    static async getAllIglooghostInfo() {
        try {
            const info = await iglooghostInfo.findAll();
            return info;
        } catch (error) {
            console.error('Error fetching IglooghostInfo:', error);
            throw error;
        }
    }
}

module.exports = DBHandler;