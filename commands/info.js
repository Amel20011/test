const os = require('os');
const config = require('../config');

module.exports = {
    name: 'info',
    description: 'Menampilkan info bot dan server',
    
    async execute(sock, from, sender, args, msg) {
        try {
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);
            
            const infoText = `*🤖 BOT INFORMATION*\n\n` +
                            `*Nama:* ${config.bot.name}\n` +
                            `*Prefix:* ${config.bot.prefix}\n` +
                            `*Owner:* ${config.bot.owner}\n` +
                            `*Uptime:* ${hours}h ${minutes}m ${seconds}s\n\n` +
                            `*🖥️ SERVER INFO*\n` +
                            `*Platform:* ${os.platform()}\n` +
                            `*Architecture:* ${os.arch()}\n` +
                            `*Memory:* ${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB free / ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB total\n\n` +
                            `_${new Date().toLocaleString()}_`;
            
            await sock.sendMessage(from, { text: infoText });
            
        } catch (error) {
            console.error('Error sending info:', error);
        }
    }
};
