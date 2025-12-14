module.exports = {
    // Bot settings
    bot: {
        name: "🤖 WhatsApp Bot",
        prefix: "!",
        owner: "6281234567890", // Your WhatsApp number
        sessionName: "session"
    },
    
    // Database (gunakan JSON untuk sederhana)
    database: {
        enabled: false,
        type: "json"
    },
    
    // Auto reply settings
    autoReply: {
        enabled: true,
        message: "Halo! Bot sedang aktif. Ketik !menu untuk melihat menu"
    },
    
    // Features
    features: {
        autoRead: true,
        antiDelete: false,
        welcomeMessage: true
    },
    
    // Menu categories
    menuCategories: [
        {
            name: "📱 MAIN MENU",
            commands: ["menu", "help", "info"]
        },
        {
            name: "⚙️ UTILITIES",
            commands: ["sticker", "getpic"]
        },
        {
            name: "🎵 MEDIA",
            commands: ["ytmp3", "ytmp4"]
        }
    ]
};
