var request = require("request");
const MovieDB = require('moviedb')('6f2a04c0f2d719ee413417fde84c633c');

var movies_json_array;
var final_result = [];

var results;

module.exports = getStarWarsMovies;

function getStarWarsMovies(callback) {
    final_result = [];
    request({
        uri: "http://swapi.co/api/films/",
        method: "GET",
        followRedirect: true,
        maxRedirects: 10
    }, function (error, response, body) {

        movies_json_array = JSON.parse(body)["results"];
        results = movies_json_array.length;
        for (index in movies_json_array) {
            getMovieID("star wars " + movies_json_array[index]['title'], callback)
        }
    });
}

function getMovieID(movie, callback) {
    MovieDB.searchMovie({ query: movie }, (err, res) => {
        try {
            getMovieInfo(res['results'][0]['id'], callback);
        } catch (error) {
            callback(error, null);
            console.log("error 1" + error + " : " + movie);
        }
    });
}

function getMovieInfo(movie, callback) {
    MovieDB.movieInfo({ id: movie }, (err, res) => {
        try {
            results--;
            final_result.push(res);
            if (results == 0){
                callback(null, final_result);
                // console.log(final_result.length);
            }
        } catch (error) {
            callback(error, null);
            console.log("error 2 " + error + " : " + movie);
        }
    });
}