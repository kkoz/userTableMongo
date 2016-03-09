var mongoose = require("mongoose");
var passHash = require("password-hash-and-salt");

var uri = "mongodb://heroku_t7gjrgm2:9m08s7c0r9a74ufuap3vaopc8r@ds017678.mlab.com:17678/heroku_t7gjrgm2";
mongoose.connect(uri);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
var connected = false;

var Schema = mongoose.Schema;
var UserSchema = new Schema({
    username : String,
    password : String
});
var User = mongoose.model("User", UserSchema);

db.once("open",function(callback){
    connected = true;
    console.log("Booyah!");

});

exports.addUser = function(args, callback)
{
    if(!connected){
        return;
    }
    var username = args.username;
    var password = args.password;
    passHash(password).hash(function(error, hash){
        if(error){
            throw new Error("Something went wrong!");
        }

        User.find({"username" : username}).
            exec(function(err, users){
            console.log("In the User.find Callback");
            if(users.length === 0){
                var userData = 
                {
                    "username": username,
                    "password": hash,
                };
                var userRecord = new User(userData);
                console.log("new user: " + userData.username);
                userRecord.save(function(err){
                    if(err){
                        console.error("Failed to save new user!");
                        callback(-1);
                        return;
                    }
                    else{
                        console.log("Save successful!");
                        callback(0);
                        return;
                    }
                });
            }
            else{
                console.log("Tried to create acct with existing username");
                callback(1);
                return;
            }
        });
    });
};

exports.loginUser = function(args, callback)
{
    if(!connected){
        return;
    }
    var username = args.username;
    var password = args.password;
    User.find({"username" : username}).
        select("password").
        exec(function(err, users){
            if(err){
                throw new Error("Some error occurred when trying to login");
            }
            if(users.length === 0){
                callback(1);
                return;
            }
            passHash(password).verifyAgainst(
                users[0].password, function(err, verified){
                    if(err){
                        throw new Error("Something went wrong with verifying hash");
                    }
                    if(!verified){
                        console.log("Don't try, we got you!");
                        callback(2);
                        return;
                    }
                    else if(verified){
                        callback(0);
                        return;
                    }
                });
    });
};

exports.findAllUsers = function()
{
    if(!connected){
        return;
    }
    User.find(function(err, users){
        if(err){
            return console.error(err);
        }
        console.log(users);
    });
}

exports.findByUsername = function(args, callback)
{
    if(!connected){
        return;
    }
    User.find({username : args.username}).
        exec(function(err, users){
            if(err){
                console.error(err);
                throw new Error(JSON.stringify(err));
            }
            callback(rc, users);
        });
};

