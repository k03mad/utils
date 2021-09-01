'use strict';

const env = require('../../../env');
const got = require('../../utils/request/got');

/**
 * @param {object} params
 * @returns {object}
 */
module.exports = async (params = {}) => {
    const {body} = await got('https://ws.audioscrobbler.com/2.0/', {
        searchParams: {
            api_key: env.lastfm.key,
            format: 'json',
            ...params,
        },
    });

    return body;
};
