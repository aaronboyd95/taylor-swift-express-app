const express = require("express");
const inventoryController = require(`${__dirname}/../controllers/flexApiController`);

const router = express.Router();

router
    .route("/")
    .get(
        inventoryController.getAll
    );

module.exports = router;