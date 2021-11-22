'use strict';

const diff = require('../../utils/date/diff');
const get = require('./get');

/**
 * @param {object} opts
 * @param {boolean} opts.onlyAired
 * @param {object} opts.gotOpts
 * @returns {Promise<Array>}
 */
module.exports = async ({

    onlyAired,
    gotOpts = {},

} = {}) => {
    const shows = await get({method: 'profile.Shows', gotOpts});
    const watch = [];

    shows.forEach(elem => {
        if (
            elem.watchStatus === 'watching'
            && elem.totalEpisodes - elem.watchedEpisodes > 0
        ) {
            elem.show.title = elem.show.title.trim();
            elem.show.titleOriginal = elem.show.titleOriginal.trim();
            watch.push(elem);
        }
    });

    if (!onlyAired) {
        return watch;
    }

    await Promise.all([...watch.entries()].map(async ([i, {show}]) => {
        const [watchedEpisodes, allEpisodes] = await Promise.all([
            get({method: 'profile.Episodes', params: {showId: show.id}, gotOpts}),
            get({method: 'shows.GetById', params: {showId: show.id, withEpisodes: true}, gotOpts}),
        ]);

        const watchedIds = new Set(watchedEpisodes.map(elem => elem.id));
        const filterEpisodes = allEpisodes.episodes.filter(
            elem => !watchedIds.has(elem.id)
                && elem.airDate
                && diff({date: elem.airDate}) >= 0,
        );

        watch[i].show.episodesToWatch = filterEpisodes;
        watch[i].show.kinopoiskId = allEpisodes.kinopoiskId;
        watch[i].show.imdbId = allEpisodes.imdbId;
    }));

    return watch.filter(elem => elem.show.episodesToWatch.length > 0);
};
