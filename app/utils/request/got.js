'use strict';

const curl = require('./curl');
const debug = require('debug')('utils-mad:request:got');
const got = require('got');
const save = require('./save');
const ua = require('../../const/ua');
const {default: PQueue} = require('p-queue');

// количество запросов за промежуток времени в мс
const requestQueue = new PQueue({intervalCap: 10, interval: 1000});

/**
 * @param {string} url
 * @param {object} opts
 * @returns {Promise<object>}
 */
module.exports = (url, opts = {}) => requestQueue.add(async () => {
    opts = {...opts};

    if (!opts.timeout) {
        opts.timeout = 15_000;
    }

    if (!opts.headers) {
        opts.headers = {'user-agent': ua.tools.curl};
    } else if (!opts.headers['user-agent']) {
        opts.headers['user-agent'] = ua.tools.curl;
    }

    try {
        const response = await got(url, opts);
        await save(response);

        if (!opts.responseType) {
            try {
                response.body = JSON.parse(response.body);
            } catch {}
        }

        debug(curl(url, opts, response));
        return response;
    } catch (err) {
        await save(err);

        debug(curl(url, opts, err));
        throw err;
    }
});
