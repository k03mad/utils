'use strict';

const auth = require('../ya/auth');
const gotCache = require('../../utils/request/cache');
const {android} = require('../../const/ua');

/**
 * @param {object} opts
 * @param {string} opts.login
 * @param {string} opts.password
 * @returns {Array}
 */
module.exports = async opts => {
    const cookie = await auth(opts);
    const {body} = await gotCache('https://yandex.ru/quasar/iot', {
        headers: {
            'user-agent': android.pp,
            cookie,
        },
        responseType: 'text',
    }, {expire: '1d'});

    const [, token] = body.match(/csrfToken2":"(.+?)"/);
    return token;
};
