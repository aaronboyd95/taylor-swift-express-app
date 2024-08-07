const express = require("express");
const inventoryController = require(`${__dirname}/../controllers/songInventoryController`);

const router = express.Router();

router
    .route("/")
    .get(
        inventoryController.getAll
    );

router
    .route("/songs")
    .get(
        inventoryController.getSongs
    );

router
    .route("/songs/mostpopular/alltime/sort/:order")
    .get(
        inventoryController.getMostPlayedAllTime
    );

router
    .route("/songs/month/:month/sort/:order")
    .get(
        inventoryController.getPlaysPerMonthSorted
    );
    
module.exports = router;