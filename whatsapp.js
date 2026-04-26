const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    makeCacheableSignalKeyStore 
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const { sendPairingToTelegram } = require('./telegram');

async function startWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('session');

    const conn = makeWASocket({
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
        },
        printQRInTerminal: false,
        logger: pino({ level: "fatal" }),
        browser: ["REMEX-AI", "Safari", "3.0.0"]
    });

    // This is the bridge: 
    // It allows telegram.js to trigger a pairing request here
    global.requestPairing = async (number) => {
        try {
            let code = await conn.requestPairingCode(number);
            code = code?.match(/.{1,4}/g)?.join("-") || code;
            await sendPairingToTelegram(code);
        } catch (err) {
            console.error(err);
        }
    };

    conn.ev.on('creds.update', saveCreds);
    
    conn.ev.on('connection.update', (update) => {
        if (update.connection === 'open') console.log('✅ WhatsApp Connected');
        if (update.connection === 'close') startWhatsApp();
    });

    return conn;
}

module.exports = { startWhatsApp };
