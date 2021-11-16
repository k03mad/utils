'use strict';

const gotCache = require('./cache');

/**
 * @param {object} opts
 * @param {string} opts.resolver
 * @param {string} opts.domain
 * @param {string} opts.expire
 * @returns {Promise<object>}
 */
module.exports = async ({resolver = 'https://cloudflare-dns.com/dns-query', domain, expire = '1m'}) => {
    const {body} = await gotCache(resolver, {
        headers: {accept: 'application/dns-json'},
        searchParams: {name: domain},
    }, {expire});

    return body;
};
