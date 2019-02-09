const express = require('express');              
const _ = require('lodash');                   
const {Url} = require('../models/url');     
const router = express.Router();               
const objectId = require('mongodb').ObjectId;              

const shrturl = require('url');

const hash = require('shorthash');             

const useragent = require('useragent')

router.get('/', (req, res) => {
    Url.find().then((urls) => {
        res.send(urls);
    }).catch((err) => {
        res.send(err);
    });
});

router.post('/', (req, res) => {
    let body = req.body;
    let url = new Url(body);
    url.save().then((url) => {
        res.send({ url });
    }).catch((err) => {
        res.send(err);
    })
})

router.delete('/:id', (req, res) => {
    let id = req.params.id;
    Url.findByIdAndRemove(id).then((url) => {
        if (url) {
            res.send(url);
        } else {
            res.send({
                notice: 'url not found'
            });
        }
    }).catch((err) => {
        res.send(err);
    });
});

router.put('/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Url.findByIdAndUpdate({ _id: id }, { $set: body }, { new: true, runValidators: true }).then((url) => {
        if (!url) {
            res.send({
                notice: 'url not found'
            })
        }
        res.send({
            url,
            notice: 'Successfully updated url'
        });
    });
});

router.get('/tags', (req, res) => {
    let tagName = req.query.names;
    console.log(tagName);
    tagName = tagName.split(',');
    console.log(tagName);
    Url.find({ tags: { "$in": tagName } })
        .then((url) => {
            res.send(url);
        }).catch((err) => {
            res.send(err);
        });
});

router.get('/tags/:name', (req, res) => {
    let tagName = req.params.name;
    console.log(tagName);
    Url.find({ tags:tagName })
        .then((url) => {
            res.send(url);
        }).catch((err) => {
            res.send(err);
        });
});

router.get('/:id', (req, res) => {
    let id = req.params.id;
    Url.findById(id).then((urls) => {
        res.send(urls);
    }).catch((err) => {
        res.send(err);
    });
});

router.use(function (req, res, next) {      
    res.status(404).send('the resource you are looking for does not exists');
});

router.get('/:hash', (req, res) => {

    let hash = req.params.hash;
    let agent = useragent.parse(req.headers['user-agent']);
    let arrayElement = {     
        ipAddress: req.ip,
        browserName: agent.family,
        osType: agent.os,
        deviceType: agent.device
    };

    
    Url.findOne({ hashedUrl: hash }).then((url) => {
        if (!url) {
            res.send({
                notice: 'url not found'
            });
        }
        Url.findOneAndUpdate({ hashedUrl: hash }, { $push: { clicks: arrayElement}} ).then((response) => {  
            res.redirect(
                url.originalURL
            );
        });
    });
});

module.exports = router;