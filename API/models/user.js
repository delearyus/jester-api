const Mongoose = require('mongoose');

const UserSchema = Mongoose.Schema({
    name: { type: String, required: true, unique: true },
    url:  { type: String, required: true, unique: true },
});

const User = Mongoose.model('user', UserSchema);

module.exports = User;

module.exports.getAllFollowed = (callback) => {
    User.find(callback);
}

module.exports.getUrl = (name,callback) => {
    User.findOne({name: name},(err,user) => {
        if (err || user) {
            callback(err,user.url)
        } else {
            callback("user not found");
        }
    });
}

module.exports.follow = (name,url,callback) => {
    newUser = new User({
        name: name,
        url:  url,
    });
    newUser.save(callback);
}

module.exports.unfollow = (name,callback) => {
    User.remove({name: name},callback);
}
