const express = require('express');
const Post    = require('./post.model.js');
const User    = require('./user.model.js');

const router = express.Router();

//
// POSTS
//

router.get('/posts', (req,res) => {
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

router.get('/posts/:id', (req,res) => {
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

router.post('/posts/text', (req,res) => {
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

router.post('/posts/image', (req,res) => {
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


router.delete('/posts/:id', (req,res) => {
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

//
// USERS
//

router.get('/users', (req,res) => {
    console.log("kdkfjahdkfjasdlkfa");
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

router.get('/users/:name', (req,res) => {
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

router.post('/users', (req,res) => {
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

router.delete('/users/:name', (req,res) => {
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

router.all('*', (req,res) => {
    res.send("API Still under construction :3");
});

module.exports = router;
