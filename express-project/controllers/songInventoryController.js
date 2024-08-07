const fs = require('fs');
const Papa = require('papaparse');

const csvFile = fs.readFileSync(`${__dirname}/../SwiftCloud-Sheet1.csv`, 'utf8');

exports.getAll = (async (req, res, next) => {
    const { song, artist, album, writer, year, excludedFields } = req.query;

    let parsedData = Papa.parse(csvFile, {
        header: true,
        dynamicTyping: true,
    });

    if (song) {
        parsedData.data = parsedData.data.filter(row =>
            String(row.Song).toLowerCase().includes(song.toLowerCase())
        );
    }

    if (album) {
        parsedData.data = parsedData.data.filter(row =>
            String(row.Album).toLowerCase().includes(album.toLowerCase())
        );
    }

    if (artist) {
        parsedData.data = parsedData.data.filter(row =>
            String(row.Artist).toLowerCase().includes(artist.toLowerCase())
        );
    }

    if (writer) {
        parsedData.data = parsedData.data.filter(row =>
            String(row.Writer).toLowerCase().includes(writer.toLowerCase())
        );
    }

    if (year) {
        parsedData.data = parsedData.data.filter(row =>
            row.Year == year
        );
    }

    if (excludedFields) {
        for (item in parsedData.data) {
            const fields = excludedFields.split(',');
            console.log("item", item);
            if (excludedFields.includes('Plays')) {
                fields.forEach((el) =>
                    delete parsedData.data[item][el],
                    delete parsedData.data[item]['Plays - June'],
                    delete parsedData.data[item]['Plays - July'],
                    delete parsedData.data[item]['Plays - August']
                );
            } else {
                fields.forEach((el) =>
                    delete parsedData.data[item][el]
                );
            }

        }

    }

    if (parsedData.data.length === 0) {
        return res.status(400).json({ message: "No data matches your search." });
    }
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