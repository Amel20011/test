const { 
    default: makeWASocket, 
    useMultiFileAuthState,
    DisconnectReason,
    Browsers,
    fetchLatestBaileysVersion,
    makeInMemoryStore,
    jidNormalizedUser
} = require('@whiskeysockets/baileys');
const P = require('pino');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Import config and handlers
const config = require('./config');
const messageHandler = require('./handlers/messageHandler');
const commandHandler = require('./handlers/commandHandler');

// Store untuk menyimpan pesan
const store = makeInMemoryStore({ });
store.readFromFile('./baileys_store.json');

// Simpan store secara berkala
setInterval(() => {
    store.writeToFile('./baileys_store.json');
}, 10000);

// Fungsi utama bot
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState(config.bot.sessionName);
    
    const { version } = await fetchLatestBaileysVersion();
    
    const sock = makeWASocket({
        version,
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        browser: Browsers.macOS('Safari'),
        getMessage: async (key) => {
            return store.loadMessage(key.remoteJid, key.id) || {};
        }
    });
    
    store.bind(sock.ev);
    
    // Event connection update
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            console.log(chalk.yellow('╔═══════════════════════════════════════╗'));
            console.log(chalk.yellow('║       SCAN QR CODE UNTUK LOGIN       ║'));
            console.log(chalk.yellow('╚═══════════════════════════════════════╝'));
            qrcode.generate(qr, { small: true });
            console.log('\n' + chalk.cyan('QR Code berhasil digenerate!'));
            console.log(chalk.gray('Scan QR Code di atas dengan WhatsApp > Setelan > Linked Devices\n'));
        }
        
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(chalk.red('Connection closed, reconnecting...'));
            
            if (shouldReconnect) {
                startBot();
            }
        } else if (connection === 'open') {
            console.log(chalk.green('✅ Bot berhasil terhubung!'));
            console.log(chalk.blue(`🤖 Nama Bot: ${config.bot.name}`));
            console.log(chalk.blue(`🎯 Prefix: ${config.bot.prefix}`));
        }
    });
    
    // Event credentials update
    sock.ev.on('creds.update', saveCreds);
    
    // Event messages upsert
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        
        if (!msg.message || msg.key.fromMe) return;
        
        // Auto read
        if (config.features.autoRead) {
            await sock.readMessages([msg.key]);
        }
        
        // Auto reply
        if (config.autoReply.enabled && !msg.key.fromMe) {
            const chat = await msg.getChat();
            if (chat.isGroup) return;
            
            setTimeout(async () => {
                await sock.sendMessage(msg.key.remoteJid, {
                    text: config.autoReply.message
                });
            }, 2000);
        }
        
        // Handle message
        await messageHandler.handleMessage(sock, msg, store);
    });
    
    // Event group participants update
    sock.ev.on('group-participants.update', async (data) => {
        if (config.features.welcomeMessage) {
            const participant = data.participants[0];
            const action = data.action;
            
            if (action === 'add') {
                const welcomeMsg = `Selamat datang @${participant.split('@')[0]} di grup! 🎉\n\nKetik ${config.bot.prefix}menu untuk melihat menu bot.`;
                await sock.sendMessage(data.id, {
                    text: welcomeMsg,
                    mentions: [participant]
                });
            }
        }
    });
    
    // Simpan session saat exit
    process.on('SIGINT', async () => {
        console.log(chalk.yellow('\n🛑 Menyimpan session dan keluar...'));
        await saveCreds();
        store.writeToFile('./baileys_store.json');
        process.exit(0);
    });
    
    return sock;
}

// Mulai bot
startBot().catch(console.error);
