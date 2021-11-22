'use strict';

const run = require('../shell/run');

/**
 * @param {string} path
 * @param {object} opts
 * @param {string} opts.trim
 * @returns {Promise<object>}
 */
module.exports = async (path, {trim} = {}) => {
    const sizes = {};
    const du = await run(`sudo du -s ${path}`);

    [...du.matchAll(/(\d+)\s+([\w/-]+)/g)]
        .forEach(([, count, folder]) => {
            if (trim) {
                folder = folder.replace(trim, '');
            }

            sizes[folder] = Number(count);
        });

    return sizes;
};
