'use strict';

module.exports = {
    cloud: {
        tg: process.env.TELEGRAM_CLOUD_TOKEN,
    },
    influx: {
        url: process.env.INFLUX_URL,
        db: process.env.INFLUX_DB,
        request: process.env.INFLUX_STORE_REQUEST_STATS,
        ipPort: process.env.INFLUX_IP_PORT,
    },
    lastfm: {
        key: process.env.LASTFM_KEY,
    },
    mikrotik: {
        host: process.env.MIKROTIK_HOST,
        user: process.env.MIKROTIK_USER,
        password: process.env.MIKROTIK_PASSWORD,
    },
    myshows: {
        client: process.env.MYSHOWS_CLIENT,
        secret: process.env.MYSHOWS_SECRET,
        login: process.env.MYSHOWS_LOGIN,
        password: process.env.MYSHOWS_PASSWORD,
    },
    pinger: {
        tg: process.env.TELEGRAM_PINGER_BOT,
    },
    syncthing: {
        ip: process.env.SYNCTHING_CLOUD_IP,
        port: process.env.SYNCTHING_CLOUD_PORT,
        key: process.env.SYNCTHING_API_KEY,
    },
    telegram: {
        me: process.env.TELEGRAM_MY_CHAT,
    },
    tinkoff: {
        token: process.env.TOAT,
        tg: process.env.TELEGRAM_TINKOFF_BOT,
    },
    tmdb: {
        key: process.env.TMDB_KEY,
    },
    ipinfo: {
        token: process.env.IPINFO_TOKEN,
    },
    yandex: {
        login: process.env.YANDEX_LOGIN,
        password: process.env.YANDEX_PASSWORD,
    },
    google: {
        email: process.env.GOOGLE_EMAIL,
    },
    next: {
        password: process.env.NEXT_DNS_PASSWORD,
        config: process.env.NEXT_DNS_CONFIG,
    },
};
