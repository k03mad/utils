'use strict';

const auth = require('../ya/auth');
const getDevice = require('./getDevice');
const getScenario = require('./getScenario');
const getToken = require('./getToken');
const got = require('../../utils/request/got');
const {android} = require('../../const/ua');

/**
 * @param {object} opts
 * @param {string} opts.login
 * @param {string} opts.password
 * @param {string} opts.deviceName
 * @param {string} opts.scenarioName
 * @param {'phrase_action'|'text_action'} opts.instance
 * @param {string} opts.value
 * @returns {Array}
 */
module.exports = async opts => {
    const defOpts = {
        deviceName: 'Яндекс Станция',
        scenarioName: 'Голос',
        instance: 'phrase_action',
        ...opts,
    };

    let [cookie, token, scenario, device] = await Promise.all([
        auth(defOpts),
        getToken(defOpts),
        getScenario(defOpts),
        getDevice(defOpts),
    ]);

    const requestOpts = {
        headers: {
            'x-csrf-token': token,
            'user-agent': android.pp,
            cookie,
        },
        json: {
            name: defOpts.scenarioName,
            icon: 'ball',
            triggers: [
                {
                    type: 'scenario.trigger.voice',
                    value: defOpts.scenarioName,
                },
            ],
            steps: [
                {
                    type: 'scenarios.steps.actions',
                    parameters: {
                        requested_speaker_capabilities: [],
                        launch_devices: [
                            {
                                id: device.id,
                                capabilities: [
                                    {
                                        type: 'devices.capabilities.quasar.server_action',
                                        state: {
                                            instance: defOpts.instance,
                                            value: defOpts.value,
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                },
            ],
        },
    };

    if (scenario) {
        await got(`https://iot.quasar.yandex.ru/m/v3/user/scenarios/${scenario.id}`, {
            method: 'PUT',
            ...requestOpts,
        });
    } else {
        await got('https://iot.quasar.yandex.ru/m/v3/user/scenarios/', {
            method: 'POST',
            ...requestOpts,
        });

        scenario = await getScenario(defOpts, '0m');
    }

    await got(`https://iot.quasar.yandex.ru/m/user/scenarios/${scenario.id}/actions`, {
        method: 'POST',
        headers: {
            'x-csrf-token': token,
            'user-agent': android.pp,
            cookie,
        },
    });
};
