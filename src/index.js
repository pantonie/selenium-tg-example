const { getTgBot } = require('./services/tg');
const {Builder, By, Capabilities } = require('selenium-webdriver');
const { tgChatId } = require('./config');

let chromeCapabilities = Capabilities.chrome();
chromeCapabilities.set("goog:chromeOptions", {
    args: [
        "--headless",
    ]
});

const bot = getTgBot();

const scanPeriod = 30 * 1000; // 30 seconds

setInterval(
async () => {

    const driver = await new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
    try {
        await driver.get('https://ssc.nemoq.se/Booking/Booking/Index/SSC');
        await driver.findElement(By.id('ServiceGroupId')).click();
        await driver.findElement(By.xpath("//*[@id=\"ServiceGroupId\"]/option[2]")).click();
        await driver.findElement(By.name('NextButtonID20')).click();
        await driver.findElement(By.name('Next')).click();
        await driver.findElement(By.className('checkbox')).click();
        await driver.findElement(By.name('Next')).click();
        //select region here
        await driver.findElement(By.id('RegionId')).click();
        await driver.findElement(By.xpath("//*[@id=\"RegionId\"]/option[4]")).click();
        await driver.findElement(By.id('SectionId')).click();
        await driver.findElement(By.xpath("//*[@id=\"SectionId\"]/option[4]")).click();
        await driver.findElement(By.name('TimeSearchButton')).click();

        // for weeks navigation
        // await driver.findElement(By.id('nextweek')).click();
        // await driver.findElement(By.id('nextweek')).click();
        // await driver.findElement(By.id('nextweek')).click();
        // await driver.findElement(By.id('nextweek')).click();
        // await driver.findElement(By.id('nextweek')).click();
        // await driver.findElement(By.id('nextweek')).click();

        let cells;
        try {
            cells = await driver.findElements(By.xpath("//div[@data-function='timeTableCell' and @aria-label != 'Bokad']"));
            if (cells.length) {
                console.log("\007");
                let str='';
                for (const cell of cells) {
                    const time = await cell.getAttribute('data-fromdatetime');
                    str += `|${time}`;
                }
                console.log(str);
                bot.sendMessage(tgChatId,`${str}|`);
            }
        } catch (e){
            // console.log(e);
        }
    } catch(e) {

    }
    finally {
        // console.log('checked');
        await driver.quit();
    }
}, scanPeriod);
