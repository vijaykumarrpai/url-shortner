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

router.get('/tag/:name', (req, res) => {
    let tag = req.params.name;
    urls.aggregate([{$match: {Tags: tag}}], function(err, url){
        if(url.length == 0) {
            res.send({
                notice: 'Tag not found'
            })
        } else {
            res.send(url)
        }
    })
})

router.get('/tags/:name', (req, res) => {
    let tag = req.query.name;
    urls.aggregate([{$match:{Tags: tag}}], function(err, url){
        if(url.length == 0) {
            res.send({
                notice: 'Tag not found'
            })
        } else {
            res.send(url)
        }
    })
})

router.post('/', (req, res) => {
    let doc = req.body;
    let body = _.pick(req.body,['Title', 'OriginalUrl', 'Tags']);
    let originalUrl = doc.OriginalUrl;

    let agent = useragent.lookup(req.headers['user-agent']);

    let url = new urls(body);

    url.click.browser = agent.toAgent();
    url.click.os = agent.os.family;
    url.HashedUrl = hash.unique(originalUrl);
    url.click.device = agent.device.family;
    url.click.clickedDateAndTime = Date();
    url.click.userIpaddress = req.ip;

    url.save().then((url) => {
        res.send({
            url
        });
    })
        .catch((err) => {
            res.send(err);
        })
    });

    router.put('/:id', (req, res) => {
        let id = req.params.id;
        let body = _.pick(req.body,['Title', 'OriginalUrl', 'Tags']);

        urls.findById(id).then((url) => {
            let title = body.Title
            let originalUrl = body.OriginalUrl
            let tags = body.Tags;

            url.Title = title;
            url.Tags = tags;
            url.OriginalUrl = originalUrl;

            url.save(function (err, updateurl){
                res.send(updateurl);
            })
        })
        .catch((err) => {
            res.send(err);
        })
    })

    router.delete('/:id', (req, res) => {
        let id = req.params.id;

        if(!objectId.isValid(id)){
            res.send({
                notice: 'Invalid Id'
            })
        }

        urls.findByIdAndRemove(id).then((url) => {
            if(url) {
                res.send({
                    url,
                    notice: 'url deleted successfully'
                })
            } else {
                res.status(404).send({
                    notice: 'url already deleted'
                })
            }
        })
        .catch((err) => {
            res.send(err);
        });
    })

    module.exports = router;