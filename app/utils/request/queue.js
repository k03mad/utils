'use strict';

/* eslint-disable no-underscore-dangle */

const debug = require('debug')('utils-mad:request:queue');
const env = require('../../../env');
const {default: PQueue} = require('p-queue');

const influx = env.influx.url.replace('http://', '');

const requestQueue = {
    '*': {
        '*': {concurrency: 5},
    },

    'api.nextdns.io': {
        PATCH: {intervalCap: 1, interval: 1000},
        DELETE: {intervalCap: 1, interval: 1000},
    },

    [influx]: {
        '*': {concurrency: 50},
    },
};

/**
 * Поставить логирование на простой очереди
 * @param {string} name
 * @param {string} method
 */
const setLogOnActiveEvent = (name, method) => {
    requestQueue[name][method].on('active', () => {
        const {size, pending, _interval, _intervalCap, _concurrency} = requestQueue[name][method];

        const opts = _interval > 0
            ? `${_intervalCap} rp ${_interval} ms`
            : `${_concurrency} concurrent`;

        debug(`[${method}: ${name}] ${opts} | queue: ${size} | running: ${pending}`);
    });
};

/**
 * Получить очередь по названию
 * @param {string} name
 * @param {string} method
 * @returns {object}
 */
const getQueue = (name, method = 'GET') => {
    if (!requestQueue[name]) {
        requestQueue[name] = {'*': new PQueue(requestQueue['*']['*'])};
        setLogOnActiveEvent(name, '*');

    } else if (requestQueue[name][method]) {
        if (!requestQueue[name][method]._events) {
            requestQueue[name][method] = new PQueue(requestQueue[name][method]);
            setLogOnActiveEvent(name, method);
        }

    } else if (!requestQueue[name]['*']) {
        requestQueue[name]['*'] = new PQueue(requestQueue['*']['*']);
        setLogOnActiveEvent(name, '*');

    } else if (requestQueue[name]['*'] && !requestQueue[name]['*']._events) {
        requestQueue[name]['*'] = new PQueue(requestQueue[name]['*']);
        setLogOnActiveEvent(name, '*');
    }

    return requestQueue[name][method] || requestQueue[name]['*'];
};

module.exports = {getQueue};
