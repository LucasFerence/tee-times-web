import fastifyPlugin from 'fastify-plugin'

import webdriver from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome.js'
import { DateTime } from "luxon"

// Example: 2022-07-08
const DATE_FORMAT = 'yyyy-LL-dd'

// Example: 1:30 PM
const TIME_FORMAT = 't'

async function bookTime(fastify, options) {

    fastify.decorate('book', doBookTime)
}

async function doBookTime(fastify, params) {

    const options = new chrome.Options()

    // Always set to headless
    options.headless()
    options.addArguments('--no-sandbox')

    const driver = new webdriver.Builder()
        .forBrowser('chrome')
        .usingServer('http://webdriver:4444/wd/hub')
        .setChromeOptions(options)
        .build()

    // Set a pretty big timeout in-case stuff is slow
    driver.manage().setTimeouts({
        implicit: 30000    
    })

    try {
        const clubId = params.clubId
        const courseId = params.courseId
        const date = DateTime.fromISO(params.date)

        if (date.invalidExplanation) {
            console.error(`Date: ${date.invalidExplanation}`)
            return
        }

        const formattedDate = date.toFormat(DATE_FORMAT)

        var url = `https://www.chronogolf.com/club/${clubId}`
            + `/widget?medium=widget&source=club#?date=${formattedDate}`
            + `&course_id=${courseId}&nb_holes=18&affiliation_type_ids=`

        const amtPlayers = params.amtPlayers

        for (var i = 0; i< amtPlayers; i++) {

            if (i != 0 && i != amtPlayers) {
                url += ','
            }

            url += '85113'
        }

        console.log(`Loading base URL: [${url}]`)

        // Load the base URL
        await driver.get(url)

        // Calculate date ranges
        const startDate = DateTime.fromISO(params.earliestTime)
        const endDate = DateTime.fromISO(params.latestTime)

        // Return a validation reason if necessary
        if (startDate.invalidExplanation) {
            console.error(`Start date: ${startDate.invalidExplanation}`)
            return
        }

        if (endDate.invalidExplanation) {
            console.error(`End date: ${endDate.invalidExplanation}`)
            return
        }

        // Find widget for the tee times
        const teeTimeWidget = await driver.findElement({className: 'widget-teetimes'})

        // Init to null in-case we don't find anything
        var teeTime = null

        // Get all of the tee time elements
        const teeTimesElements = await teeTimeWidget.findElements({className: 'widget-teetime'})
        for (const teeTimeElement of teeTimesElements) {

            var teeTimeValue = await teeTimeElement.findElement({className: 'widget-teetime-tag'})
                .getAttribute('innerHTML')

            // Trim the extra space around the value
            teeTimeValue = teeTimeValue.toString().trim()

            // Calculate a datetime by parsing the time from widget
            
            // Parse it to new york time since that is the time returned from MCG Golf
            // TODO: Make this more configurable or based on browser date (the date we are comparing to)
            // This needs to be the same timezone that is beign rendered on the site
            const currTime = DateTime.fromFormat(teeTimeValue, TIME_FORMAT)
                .setZone('America/New_York', { keepLocalTime: true });
            
            const currDate = date.set({hour: currTime.hour, minute: currTime.minute})
                .setZone('America/New_York', { keepLocalTime: true });

            if (currDate >= startDate && currDate <= endDate) {

                teeTime = await teeTimeElement.findElement({className: 'widget-teetime-rate'})
                console.log(`Found tee time at: ${teeTimeValue}`)

                break
            }
        }

        if (teeTime != null) {
            await teeTime.click()
        } else {
            console.log('Could not find tee time in range!')
            return
        }

        await driver
            .findElement({className: 'widget-step-confirmation'})
            .findElement({className: 'fl-button'})
            .click()
        
        const userId = params.userId
        const user = await fastify.getUser(fastify, userId)

        console.log('Logging in with provided credentials...')

        await driver.findElement({id: 'sessionEmail'}).sendKeys(user.chronogolfUsername)
        await driver.findElement({id: 'sessionPassword'}).sendKeys(user.chronogolfPassword)

        await driver.findElement({xpath: "//input[@type='submit']"}).click()

        await driver
            .findElement({tagName: 'reservation-review-terms'})
            .findElement({xpath: "//input[@type='checkbox']"})
            .click()

        if (params.checkout == true) {

            console.log('Checking out...')
            await driver
                .findElement({tagName: 'reservation-review-submit-button'})
                .findElement({xpath: "//button[@type='submit']"})
                .click()

            await driver.findElement({className: 'alert-success'})
        } else {

            console.log('Skipping checkout...')
        }
    } catch (err) {
        console.log(err)
    } finally {

        driver.quit()
    }
}

export default fastifyPlugin(bookTime)