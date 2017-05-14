var http = require('http')
var routes = require('./routes');
var hostname = 'localhost';
var port = 3000;
var artworksModel = require('./artworksModel');

var server = http.createServer(function(req,res){
    try{
        console.log(req.method + ' ' + req.url);
        // console.log(req.headers);
        var body = [];

        if(req.method == 'GET' || req.method == 'DELETE'){
            processRequest(req.method, req.url, res)
        } else {
            req.on('data', function(chunk) {
                body.push(chunk);
            }).on('end', function() {
                body = Buffer.concat(body).toString();
                // at this point, `body` has the entire request body stored in it as a string
                processRequest(req.method, req.url, res, body);
            });    
        }
    } catch(error){
        console.log(500, error);
        res.writeHead(500);
        res.end();
    }
});

server.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname}:${port}/ \n`);
});

function processRequest(http_method, http_url, res, body){

    var proprietes = routes.getRouteProprietes(http_url);
    if(proprietes != false)
        routes.routes[proprietes['route']](http_method, res, body, proprietes['id']);
    else{
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(new artworksModel.Result()), null, 2);
    }
}
