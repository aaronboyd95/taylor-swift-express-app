const fs = require('fs');
const Papa = require('papaparse');

const csvFile = fs.readFileSync(`${__dirname}/../SwiftCloud-Sheet1.csv`, 'utf8');

exports.getAll = (async (req, res, next) => {

    const parsedData = Papa.parse(csvFile, {
        header: true,
        dynamicTyping: true,
    });

    res.status(200).json({ data: parsedData.data });
});

exports.getSongs = (async (req, res, next) => {
    let songlist = [];

    Papa.parse(csvFile, {
        header: true,
        dynamicTyping: true,
        step: (results, parser) => {
            songlist.push(results.data.Song);
        },
    });

    res.status(200).json({ data: songlist });
});

exports.getSongInfo = (async (req, res, next) => {
    let song;

    Papa.parse(csvFile, {
        header: true,
        dynamicTyping: true,
        step: (results, parser) => {
            if (results.data.Song == req.params.song) {
                song = results.data;
            }
        }
    });
    if (!song) {
        return res.status(400).json({ error: "Song not found" });
    }
    res.status(200).json({ data: song });
});

exports.getSongsByYear = (async (req, res, next) => {
    let songs = [];

    Papa.parse(csvFile, {
        header: true,
        dynamicTyping: true,
        step: (results, parser) => {
            if (results.data.Year == req.params.releaseYear) {
                songs.push(results.data.Song);
            }
        }
    });
    if (songs.length === 0) {
        return res.status(400).json({ error: `No Songs Found for year ${req.params.releaseYear}` });
    }
    res.status(200).json({ data: songs });
});

exports.getPlaysPerMonthSorted = (async (req, res, next) => {
    let songs = [];

    Papa.parse(csvFile, {
        header: true,
        dynamicTyping: true,
        step: (results, parser) => {
            if (results.data[`Plays - ${req.params.month}`]) {
                songs.push({ song: results.data.Song, plays: results.data[`Plays - ${req.params.month}`] });
            }
        }
    });
    // Sort by asc or desc
        if (req.params.order === 'desc') {
            songs.sort((a, b) => parseFloat(b.plays) - parseFloat(a.plays));
        } else if (req.params.order === 'asc') {
            songs.sort((a, b) => parseFloat(a.plays) - parseFloat(b.plays));
        } else {
            return res.status(400).json({ error: `Invalid Sort Order. Accepted Values are 'asc' and 'desc'` });
        }


    if (songs.length === 0) {
        return res.status(400).json({ error: `No Songs Found for month ${req.params.month}` });
    }

    res.status(200).json({ data: songs });
});


exports.getMostPlayedAllTime = (async (req, res, next) => {
    let songs = {};

    Papa.parse(csvFile, {
        header: true,
        dynamicTyping: true,
        step: (results, parser) => {
            for (column in results.data) {
                if (column.includes('Plays -')) {
                    if (!songs[String(results.data.Song)]) {
                        songs[String(results.data.Song)] = results.data[column];
                    } else {
                        songs[String(results.data.Song)] += results.data[column];
                    }

                }
            }
        }
    });

    if (req.params.order === 'desc') {
        songs = Object.fromEntries(
            Object.entries(songs).sort((a, b) => b[1] - a[1])
        );
    } else if (req.params.order === 'asc') {
        songs = Object.fromEntries(
            Object.entries(songs).sort((a, b) => a[1] - b[1])
        );
    } else {
        return res.status(400).json({ error: `Invalid Sort Order. Accepted Values are 'asc' and 'desc'` });
    }


    res.status(200).json({ data: songs });
});