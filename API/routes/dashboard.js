const express = require('express');
const async   = require('async');
const Post    = require('../models/post.js');
const User    = require('../models/user.js');
const Cache   = require('../models/cache.js');

const router = express.Router();

router.get('/refresh', (req,res) => {
    Cache.refreshCache((err,posts) => {
        if (err) {
            res.json({
                success: false,
                message: err
            });
        } else {
            async.map(posts, Cache.cachePost, (err,msg) => {
                if (err) {
                    res.json({
                        success: false,
                        message: `error caching post: ${err}`
                    });
                } else {
                    res.json({
                        success: true,
                        posts: posts
                    });
                }
            });
        }
    });
});

router.get('/', (req,res) => {
    Cache.getDashboardFromCache(1,(err,posts) => {
        if (err) {
            res.json({
                success: false,
                message: `Error getting posts: ${err}`
            });
        } else {
            res.json({
                success: true,
                posts: posts
            });
        }
    });
});

router.get('/page/:number', (req,res) => {
    let page = parseInt(req.params.number, 10);
    if (!page) {
        res.json({
            success: false,
            message: `Invalid page number: ${req.params.number}`
        });
    } else {
        Cache.getDashboardFromCache(page,(err,posts) => {
            if (err) {
                res.json({
                    success: false,
                    message: `Error getting posts: ${err}`
                });
            } else {
                res.json({
                    success: true,
                    posts: posts
                });
            }
        });
    }
});

module.exports = router
