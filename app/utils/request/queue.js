'use strict';

/* eslint-disable no-underscore-dangle */

const debug = require('debug')('utils-mad:request:queue');
const env = require('../../../env');
const {default: PQueue} = require('p-queue');

const requestQueue = {
    '*': {
        '*': {concurrency: 5},
    },

    'api.nextdns.io': {
        PATCH: {intervalCap: 1, interval: 1000},
        DELETE: {intervalCap: 1, interval: 1000},
    },

    [env.influx.ipPort]: {
        '*': {concurrency: 50},
    },
};

/**
 * Поставить логирование на простой очереди
 * @param {string} host
 * @param {string} method
 */
const setLogOnActiveEvent = (host, method) => {
    requestQueue[host][method].on('active', () => {
        const {size, pending, _interval, _intervalCap, _concurrency} = requestQueue[host][method];

        const opts = _interval > 0
            ? `${_intervalCap} rp ${_interval} ms`
            : `${_concurrency} concurrent`;

        debug(`[${method}: ${host}] ${opts} | queue: ${size} | running: ${pending}`);
    });
};

/**
 * Получить очередь по хосту и методу
 * @param {string} host
 * @param {string} method
 * @returns {object}
 */
const getQueue = (host, method = 'GET') => {
    // если нет очереди по хосту
    if (!requestQueue[host]) {
        // инициализируем очередь дефолтными значениями
        if (requestQueue['*'][method]) {
            // если для метода есть дефолтные, то используем их
            requestQueue[host] = {[method]: new PQueue(requestQueue['*'][method])};
            setLogOnActiveEvent(host, method);
        } else {
            // иначе дефолтные для любых методов
            requestQueue[host] = {'*': new PQueue(requestQueue['*']['*'])};
            setLogOnActiveEvent(host, '*');
        }

    // если есть очередь по хосту и методу
    } else if (requestQueue[host][method]) {
        // если очередь не инициализирована
        if (!requestQueue[host][method]._events) {
            // инициализируем
            requestQueue[host][method] = new PQueue(requestQueue[host][method]);
            setLogOnActiveEvent(host, method);
        }

    // если нет очереди по хосту и любому методу
    } else if (!requestQueue[host]['*']) {
        // инициализируем очередь дефолтным значением для всех методов
        requestQueue[host]['*'] = new PQueue(requestQueue['*']['*']);
        setLogOnActiveEvent(host, '*');

    // если есть очередь по хосту и любому методу, но она ещё не проинициализирована
    } else if (!requestQueue[host]['*']._events) {
        requestQueue[host]['*'] = new PQueue(requestQueue[host]['*']);
        setLogOnActiveEvent(host, '*');
    }

    return requestQueue[host][method] || requestQueue[host]['*'];
};

module.exports = {getQueue};
