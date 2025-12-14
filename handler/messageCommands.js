const config = require('../config');
const fs = require('fs');
const path = require('path');

// Load all commands
const commands = {};
const commandsPath = path.join(__dirname, '../commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    commands[command.name] = command;
}

module.exports = {
    async handleCommand(sock, from, sender, command, args, msg) {
        try {
            const cmd = commands[command];
            
            if (cmd) {
                await cmd.execute(sock, from, sender, args, msg);
            } else {
                // Jika command tidak ditemukan
                await sock.sendMessage(from, {
                    text: `❌ Command "${command}" tidak ditemukan.\nKetik *${config.bot.prefix}menu* untuk melihat daftar command.`
                });
            }
            
        } catch (error) {
            console.error('Error executing command:', error);
            await sock.sendMessage(from, {
                text: '❌ Terjadi error saat menjalankan command.'
            });
        }
    },
    
    getAllCommands() {
        return commands;
    }
};
