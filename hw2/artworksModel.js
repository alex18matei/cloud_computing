module.exports.Artwork = Artwork;
function Artwork(id, title, author, year) {
  this.id = id;
  this.title = title;
  this.author = author;
  this.year = year;
}

module.exports.Result = Result;
function Result(status_code = 404, error = "Not found", data = [], page = 1 , maxElemPerPage = 10) {
    this.status_code = status_code;
    this.error = error;
    this.page = page;
    this.maxElemPerPage = maxElemPerPage;
    this.dataSize = data.length;
    this.data = data;
}

var artworks = []

artworks.push(new Artwork(1, "Hora de peste Olt", "Aman Theodor", 1950));
artworks.push(new Artwork(2, "Interior Oriental", "Aman Theodor", 1951));
artworks.push(new Artwork(3, "Regimul vechi", "Aman Theodor", 1955));
artworks.push(new Artwork(4, "Batran Croitor", "Ion Iliescu", 2009));


module.exports.getArtworks = function(){
    return artworks
}

module.exports.deleteArtworks = function(){
    artworks.length = 0;
}

module.exports.setArtworks = function(newArtworks){
    artworks = newArtworks;
}

module.exports.getArtwork = function(id){
    return artworks.find(function(element){
        return element.id == id;
    });
}

module.exports.deleteArtwork = function(id){
    var index = artworks.findIndex(function(element){
        return element.id == id;
    });
    if (index > -1) {
        remove(index);        
        return 204;
    }
    return 404;
}

function remove(index){
    artworks.splice(index, 1);
}

module.exports.updateArtwork = function(id, updated_artwork){
    if( !isArtworkObject(updated_artwork))   
        return 400;

    var index = artworks.findIndex(function(element){
        return element.id == id;
    });
    if (index > -1) {
        artworks[index] = updated_artwork;
        return 201;
    }
    return 404;
}

module.exports.addArtwork = function(new_artwork){
    if(new_artwork.id == null)
        return 400;
    var index = artworks.findIndex(function(element){
        return element.id == new_artwork.id;
    });
    if (index > -1) {
        return 409;
    }
    if( isArtworkObject(new_artwork)){
        artworks.push(new_artwork);
    } else {
        return 400; 
    }
    return 201;
}

function isArtworkObject(object) {
    return areEquals(Object.keys(object), Object.keys(new Artwork()));
}

function areEquals(array1, array2) {
    if(array1.length !== array2.length) 
        return false;

    array1.sort();
    array2.sort();

    return JSON.stringify(array1) == JSON.stringify(array2);
}