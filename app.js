const express   = require('express');
const path      = require('path');
const bodyParser= require('body-parser');
const cors      = require('cors');
const mongoose  = require('mongoose');

const api       = require('./API/api.routes');
const config    = require('./config/db');

const app = express();
mongoose.connect(config.database, {useMongoClient: true});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//we want the server to run on port 3000
const port = 3000;

//use the CORS middleware to enable Cross-Origin Requests (like fonts)
app.use(cors());

//use bodyParser for parsing url-encoding and JSON objects in requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//refer requests to /api/* to the api router at API/api.routes.js
app.use('/api', api);

//for all other paths, give a default page
app.get("*", (req,res) => {
    res.send("This server is API only, there is no front-end, sorry :(");
});

//start the server on port 3000
app.listen(port, () => {
    console.log(`starting server on port ${port}`);
});
