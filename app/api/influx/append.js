'use strict';

const convert = require('../../utils/array/convert');
const query = require('./query');
const write = require('./write');

/**
 * @param {object} append
 */
module.exports = async append => {
    const prepared = [];

    for (const data of convert(append)) {
        const measOriginal = data.meas;
        const measAppend = `${data.meas}_append`;
        const measMax = `${data.meas}_max`;

        const valuesMax = {};
        const valuesAppend = {...data.values};

        await Promise.all(Object.entries(data.values).map(async ([key, value]) => {
            const queries = [
                `SELECT last("${key}") FROM "${measOriginal}"`,
                `SELECT last("${key}") FROM "${measMax}"`,
            ];

            const [original, max] = await Promise.all(queries.map(async q => {
                const {results} = await query({...data, q});
                return results[0].series?.[0]?.values?.[0]?.[1] || 0;
            }));

            if (value < original) {
                valuesMax[key] = original + max;
            }

            valuesAppend[key] = value + (valuesMax[key] || max);
        }));

        prepared.push([
            {values: data.values, meas: data.meas},
            {values: valuesMax, meas: measMax},
            {values: valuesAppend, meas: measAppend},
        ].map(elem => ({...data, ...elem})));
    }

    await write(prepared.flat());
};
