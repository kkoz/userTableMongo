var URI = require("urijs");
var request = require("request");
var userTable = require("../models/userTable.js");

module.exports = function(app, io)
{

    app.get("/", function(req, res){
        res.render("homepage.jade", {data : "somedata"});
    });

    app.get("/newAccount", function(req,res){
        res.render("createAcct.jade");
    });
    
    app.post("/createAccount", function(req, res){
        console.log(req.body);
        var username = req.body["username"];
        var password = req.body["password"];
        var callback = function(rc){
            if(rc === 0){
                res.render("homepage.jade");
            }
            else if(rc === -1){
                console.error("There's been an error!");
                res.render("homepage.jade");
            }
            else if(rc === 1){
                console.log("Tried to add duplicate username");
                res.render("createAcct.jade");
            }
        };
        var rc = userTable.addUser(username, password, callback);
    });
};
