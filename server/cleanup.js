var path = require('path'),
    fs = require('fs');

module.exports = function(name) {
    var paths = [
        path.join(__dirname, '..', 'images', 'uploads', name + '.png')
        //path.join(__dirname, '..', 'images', 'icons', name + '.png')
    ];

    paths.forEach(function(p) {
        if(fs.existsSync(p)) {
            fs.unlinkSync(p);
        }
    })
};