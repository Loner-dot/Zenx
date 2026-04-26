require('dotenv').config();
const { startWhatsApp } = require('./src/whatsapp');
const { tgBot } = require('./src/telegram');

console.log("🚀 Starting REMEX AI System...");

// Start Telegram
tgBot.launch().then(() => console.log("📡 Telegram Bridge Active"));

// Start WhatsApp
startWhatsApp();
