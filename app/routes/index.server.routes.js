var URI = require("urijs");
var request = require("request");

module.exports = function(app, io)
{

    app.get("/", function(req, res){
        res.render("homepage.jade", {data : "somedata"});
    });
};
