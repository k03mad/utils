'use strict';

module.exports = {
    // API
    adg: {
        get: require('./api/adg/get'),
        post: require('./api/adg/post'),
    },
    cloud: {
        notify: require('./api/cloud/notify'),
    },
    influx: {
        append: require('./api/influx/append'),
        query: require('./api/influx/query'),
        write: require('./api/influx/write'),
    },
    iot: {
        getDevice: require('./api/iot/getDevice'),
        getScenario: require('./api/iot/getScenario'),
        getToken: require('./api/iot/getToken'),
        send: require('./api/iot/send'),
    },
    ip: {
        info: require('./api/ip/info'),
        isLocal: require('./api/ip/isLocal'),
        lookup: require('./api/ip/lookup'),
    },
    lastfm: {
        get: require('./api/lastfm/get'),
    },
    mikrotik: {
        switch: require('./api/mikrotik/switch'),
        write: require('./api/mikrotik/write'),
    },
    myshows: {
        auth: require('./api/myshows/auth'),
        get: require('./api/myshows/get'),
        watch: require('./api/myshows/watch'),
    },
    next: {
        auth: require('./api/next/auth'),
        query: require('./api/next/query'),
        list: require('./api/next/list'),
    },
    orna: {
        get: require('./api/orna/get'),
        web: require('./api/orna/web'),
    },
    pinger: {
        check: require('./api/pinger/check'),
        notify: require('./api/pinger/notify'),
    },
    syncthing: {
        get: require('./api/syncthing/get'),
    },
    tmdb: {
        get: require('./api/tmdb/get'),
    },
    telegram: {
        sendMessage: require('./api/telegram/sendMessage'),
    },
    tinkoff: {
        notify: require('./api/tinkoff/notify'),
        portfolio: require('./api/tinkoff/portfolio'),
    },
    ya: {
        auth: require('./api/ya/auth'),
    },

    // CONST
    ua: require('./const/ua'),

    // UTILS
    array: {
        chunk: require('./utils/array/chunk'),
        convert: require('./utils/array/convert'),
        count: require('./utils/array/count'),
        diff: require('./utils/array/diff'),
        mergeCol: require('./utils/array/mergeCol'),
        next: require('./utils/array/next'),
        random: require('./utils/array/random'),
        shuffle: require('./utils/array/shuffle'),
        sum: require('./utils/array/sum'),
    },
    date: {
        diff: require('./utils/date/diff'),
        now: require('./utils/date/now'),
        sub: require('./utils/date/sub'),
    },
    folder: {
        erase: require('./utils/folder/erase'),
        size: require('./utils/folder/size'),
    },
    hosts: {
        comment: require('./utils/hosts/comment'),
        sort: require('./utils/hosts/sort'),
    },
    number: {
        parse: require('./utils/number/parse'),
    },
    object: {
        count: require('./utils/object/count'),
        path: require('./utils/object/path'),
        reverse: require('./utils/object/reverse'),
    },
    parse: {
        text: require('./utils/parse/text'),
    },
    print: {
        ex: require('./utils/print/ex'),
        log: require('./utils/print/log'),
    },
    promise: {
        delay: require('./utils/promise/delay'),
    },
    repo: {
        run: require('./utils/repo/run'),
        update: require('./utils/repo/update'),
    },
    request: {
        cache: require('./utils/request/cache'),
        curl: require('./utils/request/curl'),
        doh: require('./utils/request/doh'),
        got: require('./utils/request/got'),
        proxy: require('./utils/request/proxy'),
    },
    shell: {
        run: require('./utils/shell/run'),
    },
    string: {
        firstUpper: require('./utils/string/firstUpper'),
        escape: require('./utils/string/escape'),
        split: require('./utils/string/split'),
    },
};
