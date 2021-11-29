'use strict';

const filenamify = require('filenamify');

/**
 * @param {string} str
 * @returns {string}
 */
module.exports = str => filenamify(str, {replacement: '_'}).replace(/_+/g, '_');
