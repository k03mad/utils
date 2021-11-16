'use strict';

const convert = require('xml-js');
const gotCache = require('../../utils/request/cache');

/**
 * @param {string} ip
 * @returns {object}
 */
module.exports = async ip => {
    const {body} = await gotCache(
        'http://api.geoiplookup.net/', {searchParams: {query: ip}},
        {expire: '30d'},
    );

    const converted = convert.xml2js(body, {
        compact: true,
        trim: true,
        nativeType: true,
        ignoreDeclaration: true,
    });

    return Object.fromEntries(Object
        .entries(converted.ip.results.result)
        // eslint-disable-next-line no-underscore-dangle
        .map(([key, value]) => [key, value._text]));
};
