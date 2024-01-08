const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');  // Import the cors middleware
const bodyParser = require('body-parser');
const secretManagement = require('./utils/config');


app.use(bodyParser.raw({ type: "application/octet-stream" }));




const port = 3000;

// Import route handlers
app.use(cors());

const router = require('./routes');


// Use route handlers
app.use('/', router);



app.use(express.static(path.join(__dirname, 'public')));

// load config

secretManagement.loadSecrets();


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
