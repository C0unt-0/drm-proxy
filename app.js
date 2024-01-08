const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');  // Import the cors middleware
const bodyParser = require('body-parser');
require('dotenv').config();
const config = require('./utils/config');


app.use(bodyParser.raw({ type: "application/octet-stream", inflate: false }));
app.use(cors());



const router = require('./routes');
app.use('/', router);

app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(config.PORT, () => {
    console.log(`Server is running on http://localhost:${config.PORT}`);
});
