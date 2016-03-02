var uri = "mongodb://heroku_t7gjrgm2:9m08s7c0r9a74ufuap3vaopc8r@ds017678.mlab.com:17678/heroku_t7gjrgm2";
var mongoose = require("mongoose");
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

exports.addUser = function(username, password, callback)
{
    if(!connected){
        return;
    }

    User.find({"username" : username}, function(err, users){
        console.log("In the User.find Callback");
        if(users.length === 0){
            var userData = 
            {
                "username": username,
                "password": password,
            };
            var userRecord = new User(userData);
            console.log("new user: " + userData.username);
            userRecord.save(function(err){
                if(err){
                    console.error("Failed to save new user!");
                    callback(-1);
                }
                else{
                    console.log("Save successful!");
                    callback(0);
                }
            });
        }
        else{
            console.log("Tried to create acct with existing username");
            callback(1);
        }
    });
};

exports.findAllUsers = function()
{
    if(!connected){
        return;
    }
    var User = mongoose.model("User", UserSchema);

    User.find(function(err, users){
        if(err){
            return console.error(err);
        }
        console.log(users);
    });
}

exports.findByUsername = function(username)
{
    if(!connected){
        return;
    }
};

