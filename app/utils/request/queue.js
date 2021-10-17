'use strict';

const debug = require('debug')('utils-mad:request:queue');
const env = require('../../../env');
const {default: PQueue} = require('p-queue');

const influx = env.influx.url.replace('http://', '');

const requestQueue = {
    'default': {concurrency: 5},

    'api.nextdns.io': {intervalCap: 1, interval: 1000},
    [influx]: {concurrency: 50},
};

/**
 * Поставить логирование на простой очереди
 * @param {string} name
 */
const setLogOnActiveEvent = name => {
    requestQueue[name].on('active', () => {
        const {size, pending, _interval, _intervalCap, _concurrency} = requestQueue[name];

        if (size > 0) {
            const opts = _concurrency === Number.POSITIVE_INFINITY
                ? `${_intervalCap} rp ${_interval} ms`
                : `${_concurrency} concurrent`;

            debug(`[${name}] ${opts} | wait for run: ${size} | running: ${pending}`);
        }
    });
};

/**
 * Получить очередь по названию
 * @param {string} name
 * @returns {object}
 */
const getQueue = name => {
    if (!requestQueue[name]) {
        requestQueue[name] = new PQueue(requestQueue.default);
        setLogOnActiveEvent(name);
    // eslint-disable-next-line no-underscore-dangle
    } else if (!requestQueue[name]._events) {
        requestQueue[name] = new PQueue(requestQueue[name]);
        setLogOnActiveEvent(name);
    }

    return requestQueue[name];
};

module.exports = {getQueue};
