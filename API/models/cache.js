const Mongoose = require('mongoose');
const async = require('async');
const request = require('request');

const User = require('./user.js');

const posts_per_page = 4

const CacheSchema = Mongoose.Schema({
    postType: {
        required: true,
        type: String,
        enum: ["text","image","video","link"],
    },
    body: { },
    //body has no specified type, but in theory must be a valid post body
    author: {
        required: true,
        type: {
            name: String,
            url: String
        }
    },
    via: {
        name: String,
        url: String
    },
    tags: [String],
    date: {
        type: Date,
        default: Date.now
    }
},{
    collection: "cache"
});

const Cache = Mongoose.model('CachedPost', CacheSchema);

module.exports = Cache

module.exports.cachePost = (post,callback) => {
    let id = post["_id"]
    Cache.findOne({_id: id}, (err,res) => {
        console.log(res);
        if (err) {
            callback(err)
        } else if (res) {
            callback();
        } else {
            new Cache(post).save(callback);
        }
    });
}

module.exports.getLastFromUser = (user,callback) => {
    Cache.findOne({via: user}).sort({date: -1}).exec(callback)
}

module.exports.getDashboardFromCache = (pagenumber,callback) => {
    Cache.find({})
    .sort({date: -1})
    .limit(posts_per_page)
    .skip((pagenumber-1)*posts_per_page)
    .exec(callback)
}

module.exports.refreshCache = (callback) => {
    User.getAllFollowed((err,followers) => {
        if (err) {
            return callback(err)
        } else {
            return async.concat(followers,make_request,callback);
        }
    });
}

//make_request = (follower,callback) => {
    //console.log(`faking request to ${follower.url} for ${follower.name}`)
    //callback(null,"Here's a fake post");
//}

make_request = (user,callback) => {
    last_post = module.exports.getLastFromUser(user,(err,post) => {
        if (err) return null
        if (!post) return null
        return post.date
    });
    url = last_post ? `http://${user.url}/api/posts?since=${last_post}`
                    : `http://${user.url}/api/posts`
    request(url, (err,res,body) => {
        if (body) body = JSON.parse(body);
        if (err) {
            //console.log(err);
            return callback(null,[])
        } else if (body && body.success && body.posts) {
            return callback(null,body.posts.sort((a,b) => {
                return -(new Date(a.date) - new Date(b.date))
            }))
        } else {
            console.log("no error");
            console.log(body);
            console.log(body.success);
            return callback(null,[])
        }
    });
}





