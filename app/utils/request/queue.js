'use strict';

const debug = require('debug')('utils-mad:request:queue');
const env = require('../../../env');
const {default: PQueue} = require('p-queue');

const influx = env.influx.url.replace('http://', '');

const requestQueue = {
    'default': 10,

    'rutor.info': 5,
    'api.themoviedb.org': 50,
    [influx]: 100,
};

const getQueueRpsOptions = rps => ({intervalCap: rps, interval: 1000});

/**
 * Поставить логирование на простой очереди
 * @param {string} name
 */
const setLogOnActiveEvent = name => {
    requestQueue[name].on('active', () => {
        const {size, pending, _intervalCap} = requestQueue[name];

        if (size > 0) {
            debug(`[${name}] ${_intervalCap} rps | wait for run: ${size} | running: ${pending}`);
        }
    });
};

/**
 * Получить очередь по названию
 * @param {string} name
 * @returns {object}
 */
const getQueue = name => {
    if (typeof requestQueue[name] === 'number') {
        requestQueue[name] = new PQueue(getQueueRpsOptions(requestQueue[name]));
        setLogOnActiveEvent(name);
    }

    if (!requestQueue[name]) {
        requestQueue[name] = new PQueue(getQueueRpsOptions(requestQueue.default));
        setLogOnActiveEvent(name);
    }

    return requestQueue[name];
};

module.exports = {getQueue};
