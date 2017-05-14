var artworksModel = require('./artworksModel');

module.exports = function (http_method, res, body){
    var artworks = {
      'GET' : getArtworks, 
      'POST' : postArtwork, 
      'DELETE' : deleteArtworks
    } 
    try{
        return artworks[http_method](res, body);
    } catch(error){
        res.writeHead(403);
        res.end();
    }
}

function getArtworks(res){
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(new artworksModel.Result(200, "OK", artworksModel.getArtworks()), null, 2));
}

function deleteArtworks(res){
    artworksModel.deleteArtworks();
    res.writeHead(204, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(new artworksModel.Result(204, "All artworks have been removed", artworksModel.getArtworks()), null, 2));
}

function postArtwork(res, body){
    var status_code = artworksModel.addArtwork(JSON.parse(body));
    res.writeHead(status_code, {'Content-Type': 'application/json'});
    if( status_code == 409)
        res.end(JSON.stringify(new artworksModel.Result(409, "Resource already exists with the same id"), null, 2));
    else if (status_code == 201)
        res.end(JSON.stringify(new artworksModel.Result(201, "Resource created"), null, 2));
    else if (status_code == 400)
        res.end(JSON.stringify(new artworksModel.Result(400, "Bad Request. JSON object is not an artwork object."), null, 2));
}