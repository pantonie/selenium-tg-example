This repo contains super simple script to monitor skatteverket site for getting notification once there is free slot(s) on current or preceding week available.

To check current week just run script. To check next week uncomment one string of 
`await driver.findElement(By.id('nextweek')).click();` in `/src/index` file.

To configure Telegram notifications you need to create TG bot with bot farther:
1. Open Telegram
2. Find BotFather among contacts and chats
3. Type /newbot
4. Enter your bot name (just to know how to find in further)
5. Create .env file in repo root directory and copy API key from both father response:
`TG_TOKEN='205467xxxx:AAFWci1xxx-_To589q1...'`
6. Add chat id as `TG_CHAT_ID=-xxxxxxx`. I used this [stackoverflow](https://stackoverflow.com/questions/32423837/telegram-bot-how-to-get-a-group-chat-id) instruction.
7. Now you can run app with `npm start`

To stop execution use `pm2 stop 0` where `0` is process id.

To run monitoring in console use `pm2 monit` or `./node_modules/pm2/bin/pm2 monit
`