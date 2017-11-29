const express = require('express');
const Post    = require('../models/post.js');
const User    = require('../models/user.js');
const LocalUser    = require('../models/localuser.js');
const Session      = require('../models/session.js');

const router = express.Router();

router.get('/', (req,res) => {
    LocalUser.getAllInfo((err,info) => {
        if (err) {
            res.json({
                success: false,
                message: `error getting config info: ${err}`
            });
        } else if (!info) {
            res.json({
                success: false,
                message: "no user config info exists!"
            });
        } else {
            res.json({
                success: true,
                info: info
            });
        }
    });
});

router.get('/createnew', (req,res) => {
    LocalUser.createUserIfNoneExists((err,msg) => {
        res.send("maybe we did it? idk")
    });
});

router.post('/changepassword', (req,res) => {
    let newpass = req.body.password;
    LocalUser.changePasswordAdmin(newpass,(err,msg) => {
        if (err) {
            res.json({
                success: false,
                newpass: newpass,
                message: `Error changing password: ${err}`
            });
        } else {
            res.json({
                success: true,
                message: "Password changed successfully"
            });
        }
    });
});

router.post('/logintest', (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    LocalUser.login(username,password,(err,token) => {
        if (err) {
            res.json({
                success: false,
                message: err
            });
        } else {
            res.json({
                success: true,
                token: token
            });
        }
    });
});

router.post('/authtest', (req,res) => {
    let token = req.body.token;
    Session.checkSessionId(token, (err) => {
        if (err) {
            res.json({
                success: false,
                message: err
            });
        } else {
            res.json({
                success: true,
                message: "session token authenticated"
            });
        }
    });
});

module.exports = router;
