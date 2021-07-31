'use strict';

const run = require('../shell/run');

/**
 * @param {string} path
 * @returns {Promise<object>}
 */
module.exports = async path => {
    const sizes = {};
    const du = await run(`sudo du -s ${path}`);

    [...du.matchAll(/(\d+)\s+([\w/-]+)/g)]
        .forEach(([, count, folder]) => {
            const folderName = folder.split('/').pop();
            sizes[folderName] = Number(count);
        });

    return sizes;
};
