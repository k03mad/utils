'use strict';

const debug = require('debug')('utils-mad:request:proxy');
const got = require('./got');
const {chrome} = require('../../const/ua').win;

/**
 * @param {object} opts
 * @param {string} opts.testUrl
 * @param {number} opts.timeout
 * @param {string} opts.path
 * @param {string} opts.ua
 * @returns {Array}
 */
module.exports = async ({

    testUrl = 'ya.ru',
    timeout = 5000,
    path = 'index.php?hl=144&q=',
    ua = chrome,

} = {}) => {
    // http://free-proxy.cz/en/web-proxylist/main/uptime/1
    const phproxyList = [
        'http://fgks.org/proxy/',
        'http://filter1600.thomasharrick.com/v1/',
        'http://ukah.perdomocore.com/blink182/',
        'http://www.hell-man.de/proxy/',
        'http://www.run-new-york.de/poxy-0.5b2/',
        'https://poxy.dewil.de/',
        'https://rhythmusic.net/De1337/nothing/',
        'https://www.gauvreau.fr/',
        'https://www.mostafahamed.com/logs2/',
    ];

    const result = await Promise.race(phproxyList.map(async proxy => {
        const proxyFull = proxy + path;
        const proxyTest = proxyFull + testUrl;

        try {
            await got(proxyTest, {headers: {'user-agent': ua}, timeout});
            return proxyFull;
        } catch {}
    }));

    if (!result) {
        throw new Error('No working web proxy found');
    }

    debug(`Found fast proxy: ${result}`);
    return result;
};
