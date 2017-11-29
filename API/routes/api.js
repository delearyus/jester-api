const express = require('express');
const Post    = require('../models/post.js');
const User    = require('../models/user.js');

const router = express.Router();

const postRoutes = require('./posts.js');
const userRoutes = require('./users.js');
const configRoutes = require('./config.js');
const dashboardRoutes = require('./dashboard.js');
const auth = require('./auth.js');

router.use(auth);

router.use('/posts', postRoutes);
router.use('/users', userRoutes);
router.use('/config', configRoutes);
router.use('/dashboard', dashboardRoutes);


router.all('*', (req,res) => {
    res.send("API Still under construction :3");
});

module.exports = router;
