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

    driver.manage().setTimeouts({
        implicit: 30000
    })

    driver.get('https://google.com?' + params.courseId)
}

function validate (fastify, body) {

    return body != null
        && !fastify.isStrEmpty(body.courseId)
        && !fastify.isStrEmpty(body.date)
        && !fastify.isStrEmpty(body.earliestTime)
        && !fastify.isStrEmpty(body.latestTime)
}

export default fastifyPlugin(bookTime)