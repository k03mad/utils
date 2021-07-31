'use strict';

const got = require('../../utils/request/got');
const {syncthing} = require('../../../env');

/**
 * @param {string} path
 * @returns {Promise<object>}
 */
module.exports = async path => {
    const {body} = await got(`http://${syncthing.ip}:${syncthing.port}/rest${path}`, {
        headers: {
            'X-API-Key': syncthing.key,
        },
    });

    return body;
};
