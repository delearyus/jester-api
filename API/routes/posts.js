const express = require('express');
const Post    = require('../models/post.js');
const User    = require('../models/user.js');

const router = express.Router();

router.get('/', (req,res) => {
    let callback = (err,posts) => {
        if (err) {
            res.json({
                success: false,
                message: `Error getting posts: ${err}`
            });
            res.end();
        } else {
            res.json({
                success: true,
                posts: posts
            });
            res.end();
        }
    };
    if (req.query.since == null) {
        Post.getAllPosts(callback);
    } else {
        Post.getAllPostsSince(req.query.since,callback);
    };
});

router.get('/:id', (req,res) => {
    let id = req.params.id;
    Post.getPost(id, (err,post) => {
        if (err) {
            res.json({
                success: false,
                message: `Error getting post: ${err}`
            });
        } else {
            res.json({
                success: true,
                post: post
            });
            res.end();
        }
    });
});

router.post('/text', (req,res) => {
    let title = req.body.title;
    let body  = req.body.body;
    let tags  = req.body.tags.split(',');
    let user  = { name: "delearyus", url: "siegestor" };
    Post.createTextPost(title,body,tags,user, (err,msg) => {
        if (err) {
            res.json({
                success: false,
                title: title,
                body: body,
                tags: tags,
                user: user,
                message: `Error creating post: ${err}`
            });
        } else {
            res.json({
                success: true,
                message: "Post created successfully"
            });
        }
    });
});

router.post('/image', (req,res) => {
    let url = req.body.url;
    let caption = req.body.caption;
    let tags = req.body.tags.split(',');
    let user = { name: "delearyus", url: "siegestor" };
    Post.createImagePost(url,caption,tags,user, (err,msg) => {
        if (err) {
            res.json({
                success: false,
                url: url,
                caption: caption,
                tags: tags,
                user: user,
                message: `Error creating post: ${err}`
            });
        } else {
            res.json({
                success: true,
                messsage: "Post created successfully"
            });
        }
    });
});


router.delete('/:id', (req,res) => {
    let id = req.params.id;
    Post.deletePostById(id, (err, msg) => {
        if (err) {
            res.json({
                success: false,
                message: `Error deleting post: ${err}`
            });
        } else {
            res.json({
                success: true,
                message: `Post ${id} successfully deleted`
            });
        }
    });
});

module.exports = router;
