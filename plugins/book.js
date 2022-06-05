import fastifyPlugin from 'fastify-plugin'

import webdriver from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome.js'

async function bookTime (fastify, options) {

    fastify.decorate('validateBookReq', validate)
    fastify.decorate('book', doBookTime)
}

function doBookTime (params) {

    const options = new chrome.Options()

    if (params.isHeadless) {
        options.headless()
    }

    const driver = new webdriver.Builder()
        .forBrowser('chrome')
        .usingServer('http://localhost:4444/wd/hub')
        .setChromeOptions(options)
        .build()

    // Set a pretty big timeout in-case stuff is slow
    driver.manage().setTimeouts({
        implicit: 30000
    })

    const clubId = params.clubId
    const courseId = params.courseId
    const date = params.date

    var url = `https://www.chronogolf.com/club/${clubId}`
        + `/widget?medium=widget&source=club#?date=${date}`
        + `&course_id=${courseId}&nb_holes=18&affiliation_type_ids=`

    const amtPlayers = params.amtPlayers

    for (var i = 0; i< amtPlayers; i++) {

        if (i != 0 && i != amtPlayers) {
            url += ','
        }

        url += '85113'
    }

    console.log(`Loading base URL: [${url}]`)

    driver.get(url)
}

function validate (fastify, body) {

    return body != null
        && !fastify.isStrEmpty(body.clubId)
        && !fastify.isStrEmpty(body.courseId)
        && !fastify.isStrEmpty(body.date)
        && body.amtPlayers != null && body.amtPlayers != 0
        && !fastify.isStrEmpty(body.earliestTime)
        && !fastify.isStrEmpty(body.latestTime)
}

export default fastifyPlugin(bookTime)