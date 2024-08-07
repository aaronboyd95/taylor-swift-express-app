const express = require('express');
const cors = require('cors');
const songInventory = require('./routes/songInventory')
const albumInventory = require('./routes/albumInventory')

const app = express();
app.use(cors());

const port = 3000;

app.use("/", songInventory);
app.use("/albums", albumInventory);

app.listen(port, () => {
    console.log(`Server listening at port: ${port}`);
});

// this is default in case of unmatched routes
app.use(function(req, res) {
          res.json({
            'status':404,
            'error': 'Invalid Route'
          });
    });