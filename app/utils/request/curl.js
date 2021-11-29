'use strict';

const prettyBytes = require('pretty-bytes');
const {dim, white, green, blue, magenta, yellow, bgWhite, black, red} = require('chalk');

/**
 * @param {string} url
 * @param {object} opts
 * @param {string} opts.method
 * @param {object} opts.headers
 * @param {string} opts.body
 * @param {object} opts.json
 * @param {object} opts.form
 * @param {object} opts.searchParams
 * @param {string} opts.username
 * @param {string} opts.password
 * @param {object} res
 * @returns {string}
 */
module.exports = (url, {

    method = 'GET', headers = {},
    body, json, form, searchParams,
    username, password,

}, res) => {
    const msg = [];

    if (res?.response) {
        res = res.response;
    }

    if (res?.statusCode) {
        msg.push(bgWhite(black(res.statusCode)));
    }

    if (res?.timings) {
        msg.push(`[${res.timings.phases.total} ms]`);
    }

    if (res?.headers?.['content-length']) {
        msg.push(`[${prettyBytes(Number(res.headers['content-length']))}]`);
    }

    if (searchParams) {
        url += `?${new URLSearchParams(searchParams).toString()}`;
    }

    msg.push(
        white('curl -v -X'),
        green(method),
    );

    if (username && password) {
        msg.push(dim(red(`-u ${username}:${password}`)));
    }

    msg.push(blue(url));

    let bodyParams;

    if (json) {
        headers['content-type'] = 'application/json';
        bodyParams = `-d '${JSON.stringify(json)}'`;
    } else if (form) {
        headers['content-type'] = 'application/x-www-form-urlencoded';
        bodyParams = `-d '${new URLSearchParams(form).toString()}'`;
    } else if (body) {
        bodyParams = `-d '${body}'`;
    }

    const headersParams = Object.entries(headers);

    if (headersParams.length > 0) {
        msg.push(dim(magenta(headersParams.map(([key, value]) => `-H "${key}: ${value}"`).join(' '))));
    }

    if (bodyParams) {
        msg.push(dim(yellow(bodyParams)));
    }

    if (res) {
        const message = JSON.stringify(res.body || res.message);

        if (message && message.length < 1000) {
            msg.push(`\n${dim(green(message))}`);
        }
    }

    return msg.join(' ');
};
