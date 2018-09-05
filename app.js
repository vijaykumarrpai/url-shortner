const express = require('express');

const bodyParser = require('body-parser');

const _ = require('lodash');

const {objectId} = require('mongodb');

const mongoose = require('./config/db.js');

const urls = require('./models/url.js')

const urlRouter = require('./routes/urls.js');

const app = express();

const port = 3000;

app.use(bodyParser.json());

app.use('/urls', urlRouter)

app.use((req, res, next) => {
    console.log(`${req.method} - ${req.url} - ${req.ip} - ${new Date()}`);
    next();
})

app.listen(port, () => {
    console.log('Listening to port', port);
})