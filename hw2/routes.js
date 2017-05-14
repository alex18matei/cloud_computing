var artworksRoute = require('./artworksRoute');
var singleArtworkRoute = require('./singleArtworkRoute');

var routes = {
    '^/artworks(\/)?$' : artworksRoute,
    '^/artworks\/(\\d+)(\/)?$' : singleArtworkRoute
}

module.exports.routes = routes;
module.exports.getRouteProprietes = function (str){
    list = Object.keys(routes);
    for ( index in list){
        var re = new RegExp(list[index]);
        // console.log(re);
        var results = str.match(re);
        if( results ){
            // console.log(results[1]);
            return { 
              'route' : list[index], 
              'id' : results[1]
            };
        }
    }
    return false;
}