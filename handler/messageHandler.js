const commandHandler = require('./commandHandler');
const config = require('../config');

module.exports = {
    async handleMessage(sock, msg, store) {
        try {
            const from = msg.key.remoteJid;
            const type = Object.keys(msg.message)[0];
            const sender = msg.key.participant || from;
            
            // Extract text message
            let body = '';
            if (type === 'conversation') {
                body = msg.message.conversation;
            } else if (type === 'extendedTextMessage') {
                body = msg.message.extendedTextMessage.text;
            } else if (type === 'buttonsResponseMessage') {
                body = msg.message.buttonsResponseMessage.selectedButtonId;
            } else {
                return;
            }
            
            // Check if message is command
            if (body.startsWith(config.bot.prefix)) {
                const command = body.slice(config.bot.prefix.length).trim().split(' ')[0].toLowerCase();
                const args = body.slice(config.bot.prefix.length + command.length).trim();
                
                console.log(`[COMMAND] ${command} from ${sender}`);
                await commandHandler.handleCommand(sock, from, sender, command, args, msg);
            }
            
            // Save message to store
            if (store) {
                store.messages[from] = store.messages[from] || [];
                store.messages[from].push(msg);
            }
            
        } catch (error) {
            console.error('Error handling message:', error);
        }
    }
};
