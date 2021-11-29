'use strict';

const now = require('../date/now');
const {green, yellow} = require('colorette');

/**
 * @param {string} msg
 * @param {object} opts
 * @param {boolean} opts.beforeline
 * @param {boolean} opts.afterline
 * @param {boolean} opts.time
 * @param {*} opts.add
 */
module.exports = (msg, {

    beforeline = true,
    afterline = true,
    time = true,
    add,

} = {}) => {

    if (beforeline) {
        console.log('');
    }

    if (time) {
        console.log(green(now()));
    }

    if (msg) {
        console.log(msg);
    }

    if (add) {
        console.log(yellow(add));
    }

    if (afterline) {
        console.log('');
    }
};
