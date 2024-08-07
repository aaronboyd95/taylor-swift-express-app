const express = require("express");
const inventoryController = require(`${__dirname}/../controllers/albumInventoryController`);

const router = express.Router();

router
    .route("/")
    .get(
        inventoryController.getAllAlbums
    );

router
    .route("/year/:year")
    .get(
        inventoryController.getAlbumsByYear
    );

router
    .route("/artists/:album")
    .get(
        inventoryController.getArtistsByAlbum
    );

router
    .route("/album/mostpopular/month/:month/sort/:order")
    .get(
        inventoryController.getAlbumPopularityByMonth
    );

router
    .route("/album/mostpopular/alltime/sort/:order")
    .get(
        inventoryController.getAlbumPopularityAllTime
    );

module.exports = router;