const { getTgBot } = require('./services/tg');
const { Builder, By, Capabilities } = require('selenium-webdriver');
const { tgChatId } = require('./config');

let chromeCapabilities = Capabilities.chrome();
chromeCapabilities.set("goog:chromeOptions", {
    args: [
        "--headless",
    ]
});

const bot = getTgBot();

const scanPeriod = 30 * 1000; // 30 seconds

const availableTime = {};

const offices = {
    botkyrka: 2,
    kista: 3,
    kungsholmen: 4,
    liljeholmen: 5,
    sodertalje: 6
};

const officesToCheck = ['kista', 'kungsholmen', 'liljeholmen'];

if (officesToCheck.length === 0){
    throw new Error('No offices to check')
}

const searchTime = async (place, driver) => {
    let cells;
    // selects office id for the place we are looking for
    const office = await driver.findElement(By.xpath(`//*[@id=\"SectionId\"]/option[${offices[place]}]`)).getAttribute('value');
    if (!availableTime[place]) availableTime[place]=[];
    try {
        cells = await driver.findElements(By.xpath(`//div[@data-function='timeTableCell' and @aria-label != 'Bokad' and @data-sectionid='${office}']`));
        if (cells.length) {
            console.log(place, office, cells.length);
            let str='';
            for (const cell of cells) {
                const time = await cell.getAttribute('data-fromdatetime');
                const label = await cell.getAttribute('aria-label');
                console.log('label', label);
                if (!availableTime[place].includes(time)) {
                    str += `|${time}`;
                    availableTime[place].push(time);
                }
            }

            if(!!str) {
                console.log(place, str);
                bot.sendMessage(tgChatId, `${place} ${str}|`);
            }
            cells=null;
        } else {
            availableTime[place] = [];
        }
    } catch (e){}
}

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
        //select first office to check
        await driver.findElement(By.id('SectionId')).click();
        await driver.findElement(By.xpath(`//*[@id=\"SectionId\"]/option[${offices[officesToCheck[0]]}]`)).click();
        await driver.findElement(By.name('TimeSearchButton')).click();
        // await driver.manage().setTimeouts({implicit: 2000});
        // for weeks navigation
        // if you need to check next week uncomment one string below
        await driver.findElement(By.id('nextweek')).click();
        // await driver.findElement(By.id('nextweek')).click();
        // await driver.findElement(By.id('nextweek')).click();
        // await driver.findElement(By.id('nextweek')).click();
        // await driver.findElement(By.id('nextweek')).click();


        await searchTime(officesToCheck[0], driver);

        if (officesToCheck.length > 1) {
            for (let i=1; i < officesToCheck.length; i++) {
                await driver.findElement(By.id('SectionId')).click();
                await driver.findElement(By.xpath(`//*[@id=\"SectionId\"]/option[${offices[officesToCheck[i]]}]`)).click();
                await driver.manage().setTimeouts({implicit: 2000});
                await searchTime(officesToCheck[i], driver);
            }
        }
    } catch(e) {
        if (!e.message.includes('stale'))  console.log(e.message);
    }
    finally {
        await driver.quit();
    }
}, scanPeriod);
