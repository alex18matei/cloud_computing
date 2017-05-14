var artworksModel = require('./artworksModel');

module.exports = function (http_method, res, body, id){
    var singleArtwork = {
      'GET' : getArtwork, 
      'PUT' : putArtwork, 
      'DELETE' : deleteArtwork
    } 
    try{
        return singleArtwork[http_method](res, id, body);
    } catch(error){
        res.writeHead(403);
        res.end(JSON.stringify(new artworksModel.Result(403, "Server doesn't accept this method for the specified resource"), null, 2));
    }
}

function getArtwork(res, id){
    
    var artwork = artworksModel.getArtwork(id);
    if( artwork != null){
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(new artworksModel.Result(200, "OK", artwork), null, 2));
    }  else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(new artworksModel.Result(404), null, 2));
    }
    
}

function putArtwork(res, id, body){
    var status_code = artworksModel.updateArtwork(id, JSON.parse(body));
    res.writeHead(status_code, {'Content-Type': 'application/json'});
    if( status_code == 404)
        res.end(JSON.stringify(new artworksModel.Result(404), null, 2));
    else if (status_code == 201)
        res.end(JSON.stringify(new artworksModel.Result(201, "Resource updated"), null, 2));
    else if (status_code == 400)
        res.end(JSON.stringify(new artworksModel.Result(400, "Bad Request. JSON object is not an artwork object."), null, 2));
}

function deleteArtwork(res, id ){
    var status_code = artworksModel.deleteArtwork(id);
    res.writeHead(status_code, {'Content-Type': 'application/json'});
    if (status_code == 404)
        res.end(JSON.stringify(new artworksModel.Result(404), null, 2));
    else if (status_code == 204)
        res.end(JSON.stringify(new artworksModel.Result(204, "Resource created"), null, 2));
    
}