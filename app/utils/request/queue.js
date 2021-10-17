'use strict';

/* eslint-disable no-underscore-dangle */

const debug = require('debug')('utils-mad:request:queue');
const env = require('../../../env');
const {default: PQueue} = require('p-queue');

const influx = env.influx.url.replace('http://', '');

const requestQueue = {
    'default': {concurrency: 5},

    'PATCH :: api.nextdns.io': {intervalCap: 1, interval: 1000},
    'DELETE :: api.nextdns.io': {intervalCap: 1, interval: 1000},

    [influx]: {concurrency: 50},
};

/**
 * Поставить логирование на простой очереди
 * @param {string} name
 */
const setLogOnActiveEvent = name => {
    requestQueue[name].on('active', () => {
        const {size, pending, _interval, _intervalCap, _concurrency} = requestQueue[name];

        const opts = _concurrency === Number.POSITIVE_INFINITY
            ? `${_intervalCap} rp ${_interval} ms`
            : `${_concurrency} concurrent`;

        debug(`[${name}] ${opts} | wait for run: ${size} | running: ${pending}`);
    });
};

/**
 * Получить очередь по названию
 * @param {string} name
 * @param {string} method
 * @returns {object}
 */
const getQueue = (name, method = 'GET') => {
    const keyWithMethod = `${method} :: ${name}`;

    if (!requestQueue[name] && !requestQueue[keyWithMethod]) {
        requestQueue[name] = new PQueue(requestQueue.default);
        setLogOnActiveEvent(name);

    } else if (requestQueue[keyWithMethod] && !requestQueue[keyWithMethod]._events) {
        requestQueue[keyWithMethod] = new PQueue(requestQueue[keyWithMethod]);
        setLogOnActiveEvent(keyWithMethod);

    } else if (requestQueue[name] && !requestQueue[name]._events) {
        requestQueue[name] = new PQueue(requestQueue[name]);
        setLogOnActiveEvent(name);
    }

    return requestQueue[keyWithMethod] || requestQueue[name];
};

module.exports = {getQueue};
