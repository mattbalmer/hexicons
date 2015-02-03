var express = require('express'),
    config = require('config'),
    path = require('path');

require('./server/setup')();

var server = express();

server.use( require('./server/router') );
server.use( express.static( path.join(__dirname, 'public') ) );

server.listen(config.port, function() {
    console.log("%s listening on port %s in %s mode", config.name, config.port, config.env);
});