const { Telegraf } = require('telegraf');
const tgBot = new Telegraf(process.env.TELEGRAM_TOKEN);

const sendPairingToTelegram = async (code) => {
    const message = `🔢 *REMEX AI Pairing Code*:\n\n\`${code}\`\n\nEnter this in WhatsApp Linked Devices.`;
    await tgBot.telegram.sendMessage(process.env.ADMIN_TELEGRAM_ID, message, { parse_mode: 'Markdown' });
};

module.exports = { tgBot, sendPairingToTelegram };
