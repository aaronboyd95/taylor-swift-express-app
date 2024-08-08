const fs = require('fs');
const Papa = require('papaparse');

const csvFile = fs.readFileSync(`${__dirname}/../SwiftCloud-Sheet1.csv`, 'utf8');

exports.getAllAlbums = (async (req, res, next) => {
    let albums = {};

    Papa.parse(csvFile, {
        header: true,
        dynamicTyping: true,
        step: (results, parser) => {
            if (!albums[String(results.data.Album)]) {
                if (!String(results.data.Album).includes('None')) {
                    albums[String(results.data.Album)] = [results.data.Song];
                }
            } else {
                if (!String(results.data.Album).includes('None')) {
                    albums[String(results.data.Album)].push(results.data.Song);
                }
            }
        }
    });

    res.status(200).json({ data: albums });
});

exports.getAlbumsByYear = (async (req, res, next) => {
    let albums = [];

    Papa.parse(csvFile, {
        header: true,
        dynamicTyping: true,
        step: (results, parser) => {
            if (results.data.Year == req.params.year && !results.data.Album.includes('None')) {
                albums.push(results.data.Album);
            }
        }
    });

    if (albums.length === 0) {
        return res.status(400).json({ error: `Taylor swift did not release any albums in ${req.params.year}` });
    }

    // dedupe the albums array
    albums = [...new Set(albums)];

    res.status(200).json({ data: albums });
});

exports.getArtistsByAlbum = (async (req, res, next) => {
    let albums = {};

    // Need to update this to query by album
    Papa.parse(csvFile, {
        header: true,
        dynamicTyping: true,
        step: (results, parser) => {
            if (results.data.Album == req.params.album) {

                if (!albums[String(results.data.Album)]) {
                    if (!String(results.data.Album).includes('None')) {
                        albums[String(results.data.Album)] = [results.data.Artist];
                    }
                } else {
                    if (!String(results.data.Album).includes('None')) {
                        albums[String(results.data.Album)].push(results.data.Artist);
                    }
                }
            }
        }
    });
    // dedupe the albums array
    albums = [...new Set(albums[req.params.album])];
    res.status(200).json({ data: albums });
});

exports.getAlbumPopularityAllTime = (async (req, res, next) => {
    let albums = {};

    Papa.parse(csvFile, {
        header: true,
        dynamicTyping: true,
        step: (results, parser) => {
            for (column in results.data) {
                if (column.includes('Plays -')) {
                    if (!albums[String(results.data.Album)]) {
                        albums[String(results.data.Album)] = results.data[column];
                    } else {
                        albums[String(results.data.Album)] += results.data[column];
                    }

                }
            }
        }
    });
    if (req.params.order === 'desc') {
        albums = Object.fromEntries(
            Object.entries(albums).sort((a, b) => b[1] - a[1])
        );
    } else if (req.params.order === 'asc') {
        albums = Object.fromEntries(
            Object.entries(albums).sort((a, b) => a[1] - b[1])
        );
    } else {
        return res.status(400).json({ error: `Invalid Sort Order. Accepted Values are 'asc' and 'desc'` });
    }

    res.status(200).json({ data: albums });
});

exports.getAlbumPopularityByMonth = (async (req, res, next) => {
    let albums = {};

    Papa.parse(csvFile, {
        header: true,
        dynamicTyping: true,
        step: (results, parser) => {
            if (results.data[`Plays - ${req.params.month}`]) {
                if (!albums[String(results.data.Album)]) {
                    albums[String(results.data.Album)] = results.data[`Plays - ${req.params.month}`];
                } else {
                    albums[String(results.data.Album)] += results.data[`Plays - ${req.params.month}`];
                }


            }
        }
    });
    if (req.params.order === 'desc') {
        albums = Object.fromEntries(
            Object.entries(albums).sort((a, b) => b[1] - a[1])
        );
    } else if (req.params.order === 'asc') {
        albums = Object.fromEntries(
            Object.entries(albums).sort((a, b) => a[1] - b[1])
        );
    } else {
        return res.status(400).json({ error: `Invalid Sort Order. Accepted Values are 'asc' and 'desc'` });
    }

    res.status(200).json({ data: albums });
});