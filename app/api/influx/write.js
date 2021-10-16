'use strict';

const convert = require('../../utils/array/convert');
const delay = require('../../utils/promise/delay');
const escape = require('../../utils/string/escape');
const got = require('../../utils/request/got');
const now = require('nano-time');
const pMap = require('p-map');
const {influx} = require('../../../env');

/**
 * @param {object} data
 */
module.exports = async data => {
    const concurrency = 5;
    const tries = {
        count: 3,
        delay: 10_000,
    };

    const errors = [];

    await pMap(convert(data), async ({url = influx.url, db = influx.db, meas, values, timestamp = now()}) => {
        try {
            const writeData = Object.entries(values).map(elem => {
                const [key, prop] = elem;
                return [
                    escape(key, ', '),
                    typeof prop === 'string' ? `"${escape(prop, '"').trim()}"` : prop,
                ].join('=');
            }).join();

            if (writeData) {
                const path = `${url}/write`;
                const body = `${meas} ${writeData} ${timestamp}`;

                for (let i = 1; i <= tries.count; i++) {
                    try {
                        await got(path, {method: 'POST', searchParams: {db}, body});
                        break;
                    } catch (err) {
                        if (i === tries.count) {
                            throw new Error([`InfluxDB "${db}" write error:`, path, body, err].join('\n').trim());
                        } else {
                            await delay(tries.delay);
                        }
                    }
                }
            }
        } catch (err) {
            errors.push(err);
        }
    }, {concurrency});

    if (errors.length > 0) {
        throw errors.join('\n\n');
    }
};
