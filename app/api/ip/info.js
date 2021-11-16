'use strict';

const gotCache = require('../../utils/request/cache');
const {ipinfo} = require('../../../env');

/**
 * @param {string} ip
 * @returns {object}
 */
module.exports = async ip => {
    const url = `https://ipinfo.io/${ip}`;
    const tokenParams = {searchParams: {token: ipinfo.token}};
    const cacheParams = {expire: '30d'};

    let body;

    try {
        ({body} = await gotCache(url, tokenParams, cacheParams));
    } catch (err) {
        try {
            ({body} = await gotCache(url, cacheParams));
        } catch {
            throw err;
        }
    }

    return body;
};
