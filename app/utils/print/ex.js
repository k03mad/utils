'use strict';

const now = require('../date/now');
const {green, yellow, red, blue} = require('fix-esm').require('chalk').default;

let errors = 0;

/**
 * @param {object} err
 * @param {object} opts
 * @param {boolean} opts.beforeline
 * @param {boolean} opts.afterline
 * @param {boolean} opts.time
 * @param {boolean} opts.full
 * @param {string} opts.after
 * @param {string} opts.before
 * @param {boolean} opts.exit
 * @param {number} opts.exitAfter
 */
module.exports = (err, {

    beforeline = true,
    afterline = true,
    time = true,
    full, after, before,
    exit, exitAfter,

} = {}) => {
    const msg = [];

    if (beforeline) {
        msg.push('');
    }

    if (time) {
        msg.push(green(now()));
    }

    if (before) {
        msg.push(yellow(before));
    }

    if (full) {
        msg.push(err);
    } else {
        msg.push(err.toString());
    }

    let httpErr = '';

    if (err.response?.statusCode) {
        httpErr += `${red(err.response.statusCode)}:`;
    }

    if (err.options?.method) {
        httpErr += ` ${green(err.options.method)}`;
    }

    if (err.options?.url) {
        httpErr += ` ${blue(err.options.url)}`;
    }

    if (httpErr) {
        msg.push(httpErr);
    }

    if (after) {
        msg.push(yellow(after));
    }

    if (afterline) {
        msg.push('');
    }

    if (exitAfter) {
        errors++;
        msg.push(`> errors count: ${errors}/${exitAfter}`);

        if (errors > exitAfter) {
            errors = 0;
            exit = true;
        }
    }

    console.error(msg.join('\n'));

    if (exit) {
        msg.push('> kill process');
        process.exit(1);
    }
};
