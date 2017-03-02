var express = require('express');
var morgan = require('morgan');
var swFilmsRouter = require('./swfilms-router');

var hostname = 'localhost';
var port = 6969;

var app = express();

app.use(morgan('dev'));

useSwFilmsRouter(app);

app.listen(port, hostname, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function useSwFilmsRouter(app) {
    swFilmsRouter(function (err, router) {
        if (err) {
            console.log(err);
        }
        else {
            app.use('/swfilms', router);
        }
    });
};
