process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');

const { tgToken } = require('../config');


let bot;

const getTgBot = () => {
    if (bot) {
        return bot;
    }
    bot = new TelegramBot(tgToken, {polling: true});
    bot.onText(/\/echo (.+)/, (msg, match) => {
        // 'msg' is the received Message from Telegram
        // 'match' is the result of executing the regexp above on the text content
        // of the message

        const chatId = msg.chat.id;
        const resp = match[1]; // the captured "whatever"

        // send back the matched "whatever" to the chat
        bot.sendMessage(chatId, resp);
    });
    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        console.log(chatId);
        // send a message to the chat acknowledging receipt of their message
        bot.sendMessage(chatId, 'Received your message');
    });
    return bot;
}

module.exports = { getTgBot }