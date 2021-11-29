'use strict';

const auth = require('../ya/auth');
const gotCache = require('../../utils/request/cache');
const {android} = require('../../const/ua');

/**
 * @param {object} opts
 * @param {string} opts.login
 * @param {string} opts.password
 * @param {string} opts.deviceName
 * @returns {Array}
 */
module.exports = async opts => {
    const cookie = await auth(opts);
    const {body} = await gotCache('https://iot.quasar.yandex.ru/m/user/devices', {
        headers: {
            'user-agent': android.pp,
            cookie,
        },
        _cache: opts.deviceName,
    }, {expire: '1d'});

    return body.rooms
        .flatMap(elem => elem.devices)
        .find(elem => elem.name === opts.deviceName);
};
