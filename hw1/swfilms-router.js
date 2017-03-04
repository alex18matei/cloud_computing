var express = require('express');
var bodyParser = require('body-parser');
var myRequestModule = require('./my-req-module');

module.exports = function (callback) {

    try {
        var swfilmsRouter = express.Router();

        swfilmsRouter.use(bodyParser.json());

        swfilmsRouter.route('/')
            .all(function (req, res, next) {
                res.setHeader( 'Access-Control-Allow-Origin', '*');
                next();
            })

            .get(function (req, res, next) {
                getInfo(res);
            })
        
        callback(null, swfilmsRouter);
    }
    catch (error) {
        callback(error, null);
    }
}

function getInfo(response) {
    myRequestModule(function (err, res) {
        if (err) {
            console.log(err);
        }
        else {
            response.json(res);
        }
    });
};