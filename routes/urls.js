const express = require('express');
const _ = require('lodash');
const {urls} = require('../models/url.js');
const router = express.Router();
const objectId = require('mongodb').ObjectId;

const urlShortner = require('url');

const hash = require('shorthash');

const useragent = require('useragent');

router.get('/', (req, res) => {
    urls.find().then((urls) => res.send({
        urls
    }))
    .catch((err) => {
        res.send(err);
    })
})

router.get('/:id', (req, res) => {
    let id = req.params.id;
    urls.findById(id).populate('url', 'HashedUrl').then((url) => {
        if(url) {
            res.send(url)
        } else {
            res.send({
                notice: 'url not found'
            })
        }
    })
    .catch((err) => {
        res.send(err);
    })
})

router.get('/hash/:hash', (req, res) => {
    let hash = req.params.hash;
    urls.findOne({HashedUrl: hash}, function(err, url){
        res.send(url);
    })
    .catch((err) => {
        send(err);
    })
})