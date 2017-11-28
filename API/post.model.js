const Mongoose = require('mongoose');

const postSchema = Mongoose.Schema({
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
});

const Post = Mongoose.model('post',postSchema);
module.exports = Post;

//gets all posts hosted by the local user
module.exports.getAllPosts = (callback) => {
    Post.find(callback).sort({date: -1});
}

module.exports.getAllPostsSince = (time,callback) => {
    Post.find({date: { $gte: new Date(time) }}, callback).sort({date: -1});
}

//gets a specific post hosted by the local user
module.exports.getPost = (id, callback) => {
    Post.findOne({_id: id},callback);
}

//creates a text post from title, body, tags, and user {name, url}
module.exports.createTextPost = (title,body,tags,user,callback) => {
    console.log("creating post")
    newPost = new Post({
        postType: "text",
        body: {
            title: title,
            body: body,
        },
        author: user,
        tags: tags
    });
    newPost.save(callback);
};

//creates a photo post from url, caption, tags, and user {name,url}
module.exports.createImagePost = (url,caption,tags,user,callback) => {
    newPost = new Post({
        postType: "image",
        body: {
            imageUrl: url,
            caption: caption
        },
        author: user,
        tags: tags
    });
    newPost.save(callback);
};

//delete a post by its _id
module.exports.deletePostById = (id,callback) => {
    Post.remove({_id: id}, callback);
};
