'use strict';

/* eslint-disable no-underscore-dangle */

const debug = require('debug')('utils-mad:request:queue');
const env = require('../../../env');
const {default: PQueue} = require('p-queue');

const requestQueue = {
    '*': {
        '*': {concurrency: 3},
    },

    'api.themoviedb.org': {
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
 * Поставить логирование и вернуть очередь
 * @param {string} host
 * @param {string} method
 * @returns {object}
 */
const getLoggedQueue = (host, method) => {
    const queue = requestQueue[host][method];

    queue.on('active', () => {
        const {size, pending, _interval, _intervalCap, _concurrency} = queue;

        const opts = _interval > 0
            ? `${_intervalCap} rp ${_interval} ms`
            : `${_concurrency} concurrent`;

        debug(
            `[${method === '*' ? '' : `${method}: `}${host}]`
            + ` ${opts} | queue: ${size} | running: ${pending}`,
        );
    });

    return queue;
};

/**
 * Получить очередь по хосту и методу
 * @param {string} host
 * @param {string} method
 * @returns {object}
 */
const getQueue = (host, method = 'GET') => {
    // проверка на предустановленные настройки очереди для хоста и метода
    for (const elem of [method, '*']) {
        // очередь уже проинициализирована
        if (requestQueue[host]?.[elem]?._events) {
            return requestQueue[host][elem];
        }

        // очередь нужно проинициализировать
        if (requestQueue[host]?.[elem]) {
            requestQueue[host][elem] = new PQueue(requestQueue[host][elem]);
            return getLoggedQueue(host, elem);
        }
    }

    // инициализация очереди для хоста без текущего метода в предустановках
    if (requestQueue[host]) {
        requestQueue[host]['*'] = new PQueue(requestQueue['*']['*']);
        return getLoggedQueue(host, '*');
    }

    // инициализация очереди для хоста с методом из предустановок для всех очередей
    if (requestQueue['*'][method]) {
        requestQueue[host] = {[method]: new PQueue(requestQueue['*'][method])};
        return getLoggedQueue(host, method);
    }

    // нет ни хоста не метода в предустановках
    requestQueue[host] = {'*': new PQueue(requestQueue['*']['*'])};
    return getLoggedQueue(host, '*');
};

module.exports = {getQueue};
