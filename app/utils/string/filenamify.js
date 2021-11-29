'use strict';

const sanitize = require('sanitize-filename');

/**
 * @param {string} str
 * @returns {string}
 */
module.exports = str => sanitize(str, {replacement: '_'}).replace(/_+/g, '_');
