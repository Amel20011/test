const config = require('../config');

module.exports = {
    name: 'menu',
    description: 'Menampilkan menu bot dengan button',
    
    async execute(sock, from, sender, args, msg) {
        try {
            const buttonMessage = {
                text: `*${config.bot.name}*\n\n` +
                      `Halo! Saya adalah WhatsApp Bot multi-device.\n` +
                      `Prefix: *${config.bot.prefix}*\n` +
                      `Owner: *${config.bot.owner}*\n\n` +
                      `*📋 DAFTAR MENU:*\n` +
                      `⬇️ Pilih kategori di bawah:`,
                footer: `Powered by Baileys MD`,
                buttons: [
                    { buttonId: `${config.bot.prefix}main`, buttonText: { displayText: '📱 MAIN MENU' }, type: 1 },
                    { buttonId: `${config.bot.prefix}util`, buttonText: { displayText: '⚙️ UTILITIES' }, type: 1 },
                    { buttonId: `${config.bot.prefix}media`, buttonText: { displayText: '🎵 MEDIA' }, type: 1 }
                ],
                headerType: 1
            };
            
            await sock.sendMessage(from, buttonMessage);
            
        } catch (error) {
            console.error('Error sending menu:', error);
        }
    }
};
