'use strict';

const gotCache = require('../../utils/request/cache');
const {mac} = require('../../const/ua');
const {yandex} = require('../../../env');

/**
 * @param {object} opts
 * @param {string} opts.login
 * @param {string} opts.password
 * @returns {Array}
 */
module.exports = async ({login = yandex.login, password = yandex.password} = {}) => {
    const {statusCode, headers} = await gotCache('https://passport.yandex.ru/auth/', {
        method: 'POST',
        form: {
            login,
            passwd: password,
        },
        headers: {
            'user-agent': mac.ya,
        },
        followRedirect: false,
    }, {expire: '1d'});

    if (statusCode !== 302) {
        throw new Error('No auth redirect found');
    }

    if (!headers['set-cookie'].some(elem => elem.includes('Session_id'))) {
        throw new Error('No session cookies found');
    }

    return headers['set-cookie']
        .map(elem => elem.split('; ')[0])
        .join('; ');
};
