const Mongoose = require('mongoose');
const Bcrypt   = require('bcrypt');
const Crypto   = require('crypto');

const LocalUser = require('./localuser.js');

const SessionSchema = Mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    expires: {
        type: Date,
        required: true
    }
});

const Session = Mongoose.model('Session', SessionSchema);

module.exports = Session

module.exports.genNewSession = function() {
    var token = Crypto.randomBytes(64).toString('hex');
    session = new Session({
        token: token,
        expires: new Date(Date.now() + 1*24*3600*1000)
        //expires: Date.now()
    })
    session.save();
    return token;
}

module.exports.checkSessionId = (token,callback) => {
    Session.findOne({token: token}, (err,res) => {
        if (err || !res) {callback("Invalid token"); return}
        if (res.expires < Date.now()) {
            Session.remove({token: token})
            callback("Session expired")
        } else {
            callback()
        }
    });
}

module.exports.deleteSession = (token,callback) => {
    Session.findOne({token: token}, (err,res) => {
        if (err) {
            callback(err)
        } else if (!res) {
            callback("Not currently logged in, or invalid session token")
        } else {
            res.remove(callback)
        }
    });
}

