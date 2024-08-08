const express = require("express");
const inventoryController = require(`${__dirname}/../controllers/songInventoryController`);

const router = express.Router();

router
    .route("/")
    .get(
        inventoryController.getSongs
    );

router
    .route("/mostpopular/alltime/sort/:order")
    .get(
        inventoryController.getMostPlayedAllTime
    );

router
    .route("/month/:month/sort/:order")
    .get(
        inventoryController.getPlaysPerMonthSorted
    );
    
module.exports = router;