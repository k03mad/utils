'use strict';

const convert = require('../array/convert');
const cp = require('child_process');
const debug = require('debug')('utils-mad:shell:run');
const util = require('util');

const exec = util.promisify(cp.exec);

/**
 * @param {string|Array<string>} cmd
 * @param {object} opts
 * @param {boolean} opts.returnOnErr
 * @returns {string}
 */
module.exports = async (cmd, {returnOnErr} = {}) => {
    const maxBuffer = 1024 * 5000;

    const run = convert(cmd).join(' && ');
    debug('%o', run);

    let stderr, stdout;

    try {
        ({stdout, stderr} = await exec(run, {maxBuffer, shell: '/bin/bash'}));
    } catch (err) {
        if (returnOnErr) {
            ({stdout, stderr} = err);
        } else {
            throw new Error([
                'Error while trying to execute:',
                `$ ${run}`,
                `# code: ${err?.code}`,
                `# stdout: ${err?.stdout}`,
                `# stderr: ${err?.stderr}`,
            ].join('\n'));
        }
    }

    return [stdout, stderr]
        .filter(Boolean)
        .map(elem => elem.trim())
        .join('\n\n');
};
