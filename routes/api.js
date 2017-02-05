var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
var fs = require('fs');

//Config
var config = fs.readFileSync('./app_config.json', 'utf8');
config = JSON.parse(config);

var sns = new AWS.SNS({ region: config.AWS_REGION});


//End Points

router.post('/email', function(req, res, next) {

    var error = [];
    var sum = parseInt(req.cookies.contactSum, 10);

    //Validation
    if( !(/\w+/).test( req.body.name ) ) error.push("full name");
    if( !(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})$/).test( req.body.email ) ) error.push("email address");
    if( typeof req.body.msg !== "string" || req.body.msg === "" ) error.push("message");
    if( typeof req.body.message === "string" && req.body.message !== "" ) error.push("blank input");
    if( typeof sum !== "number" || sum < 1 || sum !== parseInt(req.body.val4, 10) ) error.push("maths");

    if( error.length < 1 ){

        //Send Email
        var email =
                `Contact Form\n\n`+
                `From: ${req.body.name}\n`+
                `Email: ${req.body.email}\n`+
                `Message:\n`+
                req.body.msg;


        sns.publish({
            TopicArn: config.CONTACT_TOPIC,
            Message: email
        }, function(err, data){
            if(err){
                res.json({ status: "error", err });
            } else {
                res.json({ status: "success" });
            }
        });

    } else {
        res.json({ status: "error", error });
    }
});

module.exports = router;
