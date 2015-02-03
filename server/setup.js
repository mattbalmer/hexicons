var path = require('path'),
    fs = require('fs');

module.exports = function() {
    var paths = [
        path.join(__dirname, '..', 'images', 'uploads'),
        path.join(__dirname, '..', 'images', 'icons')
    ];

    paths.forEach(function(p) {
        if(!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
    })
};