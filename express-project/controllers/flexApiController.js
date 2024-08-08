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