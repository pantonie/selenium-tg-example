require('dotenv').config();
module.exports = {
    server: { port: 4444 },
    log: {
        info: console.log,
        error: console.error
    },
    tgChatId: process.env.TG_CHAT_ID,
    tgToken: process.env.TG_TOKEN

}