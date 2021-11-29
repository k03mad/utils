'use strict';

const auth = require('../ya/auth');
const gotCache = require('../../utils/request/cache');
const {android} = require('../../const/ua');

/**
 * @param {object} opts
 * @param {string} opts.login
 * @param {string} opts.password
 * @param {string} opts.scenarioName
 * @param {string} expire
 * @returns {Array}
 */
module.exports = async (opts, expire = '1d') => {
    const cookie = await auth(opts);
    const {body} = await gotCache('https://iot.quasar.yandex.ru/m/user/scenarios', {
        headers: {
            'user-agent': android.pp,
            cookie,
        },
        _cache: opts.scenarioName,
    }, {expire});

    return body.scenarios.find(elem => elem.name === opts.scenarioName);
};
