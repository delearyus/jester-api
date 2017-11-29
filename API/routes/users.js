const express = require('express');
const Post    = require('../models/post.js');
const User    = require('../models/user.js');

const router = express.Router();

router.get('', (req,res) => {
    User.getAllFollowed( (err, users) => {
        if (err) {
            res.json({
                route: "all users",
                success: false,
                message: `Error getting users: ${err}`
            });
        } else {
            res.json({
                success: true,
                users: users
            });
        }
    });
});

router.get('/:name', (req,res) => {
    let name = req.params.name;
    User.getUrl(name, (err, url) => {
        if (err) {
            res.json({
                route: "get url",
                success: false,
                message: `Error getting user: ${err}`
            });
        } else {
            res.json({
                success: true,
                url: url
            });
        }
    });
});

router.post('', (req,res) => {
    let name = req.body.name;
    let url  = req.body.url;
    User.follow(name,url, (err, msg) => {
        if (err) {
            res.json({
                route: "follow",
                success: false,
                message: `Error following user: ${err}`
            });
        } else {
            res.json({
                success: true,
                message: `User followed successfully`
            });
        }
    });
});

router.delete('/:name', (req,res) => {
    let name = req.params.name;
    User.unfollow(name, (err,msg) => {
        if (err) {
            res.json({
                route: "unfollow",
                success: false,
                message: `Error unfollowing user: ${err}`
            });
        } else {
            res.json({
                success: true,
                message: "User successfully unfollowed"
            });
        }
    });
});

module.exports = router;
