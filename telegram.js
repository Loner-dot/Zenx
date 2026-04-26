const { Telegraf } = require('telegraf');
const { startWhatsApp } = require('./whatsapp');

const tgBot = new Telegraf(process.env.TELEGRAM_TOKEN);

// This function will be called by whatsapp.js to send the code back
const sendPairingToTelegram = async (code) => {
    const message = `🔢 *REMEX AI Pairing Code*:\n\n\`${code}\`\n\nEnter this in WhatsApp Linked Devices.`;
    await tgBot.telegram.sendMessage(process.env.ADMIN_TELEGRAM_ID, message, { parse_mode: 'Markdown' });
};

// Command to trigger pairing for a NEW number
tgBot.command('pair', async (ctx) => {
    const args = ctx.message.text.split(' ');
    if (args.length < 2) return ctx.reply('❌ Usage: /pair 234xxxxxxxxxx');
    
    const number = args[1].replace(/[^0-9]/g, '');
    ctx.reply(`⏳ Requesting code for ${number}...`);
    
    // We export a global emitter or call a function in whatsapp.js
    global.requestPairing(number);
});

module.exports = { tgBot, sendPairingToTelegram };
