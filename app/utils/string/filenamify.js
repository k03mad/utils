'use strict';

const filenamify = require('fix-esm').require('filenamify').default;

/**
 * @param {string} str
 * @returns {string}
 */
module.exports = str => filenamify(str, {replacement: '_'}).replace(/_+/g, '_');
