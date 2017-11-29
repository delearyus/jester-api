const express = require('express');
const Post    = require('../models/post.js');
const User    = require('../models/user.js');
const Session = require('../models/session.js');
const LocalUser = require('../models/localuser.js');

const router = express.Router();

auth = (req,res,next) => {
// get the authToken cookie from the request, and make sure that it belongs to
// a valid session. if so, continue to the next middleware. if not, throw an
// error
    let token = req.cookies.authToken;
    if (!token) {
        res.json({
            success: false,
            message: `Authentication error: no Auth Token`
        });
    } else {
        Session.checkSessionId(token, (err) => {
            if (err) {
                res.json({
                    success: false,
                    message: `Authentication error: ${err}`
                });
            } else {
                next()
            }
        });
    }
};

router.post('/posts/*',auth); //creating posts requires auth
router.delete('/posts/*', auth); //deleting posts requires auth
router.post('/users', auth); //all interactions w users require auth
router.delete('/users/*', auth); //all interactions w users require auth
router.get('/dashboard', auth);
router.get('/dashboard/*', auth);

router.post('/login', (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    LocalUser.login(username,password,(err,token) => {
        if (err) {
            res.json({
                success: false,
                message: err
            });
        } else {
            res.cookie("authToken", token, { path: "/api" })
            .json({
                success: true,
                token: token
            });
        }
    });
});

router.delete('/login', (req,res) => {
    let token = req.cookies.authToken;
    LocalUser.logout(token, (err) => {
        if (err) {
            res.json({
                success: false,
                message: err
            });
        } else {
            res.clearCookie("authToken", { path: "/api"}).json({
                success: true,
                message: "logged out successfully"
            });
        }
    });
});
            

module.exports = router;
