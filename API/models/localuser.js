const Mongoose = require('mongoose');
const Bcrypt   = require('bcrypt');
const Crypto   = require('crypto');

const Session  = require('./session.js');

const LocalUserSchema = Mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: String
    }
},{
    collection: "localuser"
});

const LocalUser = Mongoose.model('LocalUser',LocalUserSchema,);

module.exports = LocalUser;

module.exports.getAllInfo = (callback) => {
    LocalUser.findOne(callback)
}

module.exports.createUserIfNoneExists = (callback) => {
    localuser = new LocalUser({
        username: "secretusername",
        password: "not_set",
        url: "siegestor",
        name: "delearyus"
    });
    LocalUser.remove({}, (err) => {
        if (err) {
            callback(err)
        } else {
            localuser.save(callback);
        }
    });
}

module.exports.changePasswordAdmin = (password,callback) => {
    LocalUser.findOne((err,localuser) => {
        if (err) callback(err);
        var hash = Bcrypt.hashSync(password, 10);
        console.log(hash);
        localuser.set({ password: hash });
        localuser.save(callback);
    });
}

module.exports.login = (username,password,callback) => {
    LocalUser.findOne((err,localuser) => {
        if (err || !localuser) callback(err);
        if (username == localuser.username
           && Bcrypt.compareSync(password,localuser.password))  {
             var authtoken = Session.genNewSession();
             callback(null,authtoken);
        } else {
            callback("Invalid credentials")
        }
    });
}

module.exports.logout = (token,callback) => {
    Session.deleteSession(token, callback)
}

