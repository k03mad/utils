'use strict';

const sendMessage = require('../telegram/sendMessage');
const {cloud} = require('../../../env');

/**
 * @param {object} opts
 * @param {string} token
 * @returns {object}
 */
module.exports = (opts, token = cloud.tg) => sendMessage(opts, token);
