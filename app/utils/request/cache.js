'use strict';

const debug = require('debug')('utils-mad:request:cache');
const diffDate = require('../date/diff');
const got = require('./got');
const hasha = require('hasha');
const moment = require('moment');
const os = require('os');
const path = require('path');
const {blue, green, yellow, red, dim, cyan} = require('chalk');
const {compress, decompress} = require('shrink-string');
const {getQueue} = require('./queue');
const {promises: fs} = require('fs');

/**
 * @param {string} url
 * @param {object} gotOpts
 * @param {object} opts
 * @param {string} opts.expire
 * @returns {Promise<object>}
 */
module.exports = (url, gotOpts = {}, {expire = '7d'} = {}) => {
    const queue = getQueue('cache');

    return queue.add(async () => {
        const cacheGotResponseKeys = [
            'body',
            'headers',
            'method',
            'statusCode',
            'statusMessage',
            'timings',
        ];

        const cacheFile = path.join(
            os.tmpdir(),
            hasha('').slice(0, 10),
            hasha(process.env.npm_package_name || ''),
            hasha(url),
            hasha(JSON.stringify(gotOpts)),
        );

        await fs.mkdir(path.dirname(cacheFile), {recursive: true});

        try {
            const cache = await fs.readFile(cacheFile, {encoding: 'utf-8'});
            const text = await decompress(cache);
            const {date, cachedResponse} = JSON.parse(text);

            const match = {
                w: 'weeks',
                d: 'days',
                h: 'hours',
                m: 'minutes',
                s: 'seconds',
            };

            const count = Number(expire.replace(/\D/, ''));
            const char = expire.replace(/\d/g, '');
            const measurement = match[char];

            const currentDiff = diffDate({date, period: measurement});

            if (currentDiff < count) {
                debug(`${green('OK')} :: ${currentDiff}/${count} ${measurement} left :: ${blue(url)}\n${blue(dim(cacheFile))}`);
                return cachedResponse;
            }

            debug(`${red('EXPIRED')} :: ${currentDiff}/${count} ${measurement} left :: ${blue(url)}\n${blue(dim(cacheFile))}`);
        } catch (err) {
            if (err.code === 'ENOENT') {
                debug(`${yellow('NOT FOUND')} :: ${blue(url)}`);
            } else {
                debug(`${red('ERROR')} :: ${dim(err)} :: ${blue(url)}\n${blue(dim(cacheFile))}`);
            }
        }

        const res = await got(url, gotOpts);

        const cachedResponse = {};
        cacheGotResponseKeys.forEach(key => {
            cachedResponse[key] = res[key];
        });

        const compressed = await compress(JSON.stringify({date: moment(), cachedResponse}));
        await fs.writeFile(cacheFile, compressed);
        debug(`${cyan('SAVED')} :: ${blue(dim(cacheFile))}`);

        return res;
    });
};
