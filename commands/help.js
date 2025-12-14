const config = require('../config');
const commandHandler = require('../handlers/commandHandler');

module.exports = {
    name: 'help',
    description: 'Menampilkan bantuan command',
    
    async execute(sock, from, sender, args, msg) {
        try {
            const commands = commandHandler.getAllCommands();
            let helpText = `*${config.bot.name} - HELP*\n\n`;
            
            helpText += `*Prefix:* ${config.bot.prefix}\n\n`;
            helpText += '*📋 DAFTAR COMMAND:*\n\n';
            
            Object.keys(commands).forEach(cmd => {
                helpText += `• *${config.bot.prefix}${cmd}* - ${commands[cmd].description}\n`;
            });
            
            helpText += `\n*Contoh:* ${config.bot.prefix}menu`;
            helpText += `\n\n_Total command: ${Object.keys(commands).length}_`;
            
            await sock.sendMessage(from, { text: helpText });
            
        } catch (error) {
            console.error('Error sending help:', error);
        }
    }
};
