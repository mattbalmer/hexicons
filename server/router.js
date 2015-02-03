var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    cleanup = require('./cleanup'),
    Datauri = require('datauri'),
    common = require('common'),
    hexify = require('hexify');
var routes = module.exports = express.Router();

// Parse JSON bodies
routes.use( require('body-parser')({ limit: '2mb' }) );

routes.get('/icons', function(req, res) {
    var files = fs.readdirSync(path.join(__dirname, '..', 'images', 'icons')),
        nameQuery = common.cleanFilename(req.param('name'));

    if(nameQuery) {
        files = files.filter(function(filename) {
            return filename.indexOf(nameQuery) > -1;
        });
    }

    var json = files.map(function(filename) {
        return filename.substring(0, filename.indexOf('.'));
    });

    res.json(json);
});

routes.get('/icons/:name', function(req, res) {
    var iconName = common.cleanFilename(req.params.name) + '.png';
    res.sendFile(path.join(__dirname, '..', 'images', 'icons', iconName));
});

routes.post('/icons', function(req, res) {
    var pngRegex = /^data:.+\/(.+);base64,(.*)$/,
        matches = req.body.data_uri.match(pngRegex),
        name = common.cleanFilename(req.body.name),
        color = req.body.color;

    if(matches) {
        var data = matches[2],
            savePath = path.join(__dirname, '..', 'images', 'uploads', name+'.png'),
            loadPath = path.join(__dirname, '..', 'images', 'icons', name+'.png'),
            buffer = new Buffer(data, 'base64');

        fs.writeFileSync(savePath, buffer);

        hexify(name, color, function() {
            var dataUri = new Datauri(loadPath);

            res
                .set('Content-Type', 'image/png')
                .send(dataUri.content);
                //.set('Content-Disposition', 'attachment; filename=hexicon.jpg')

            cleanup(name);
        });
    } else {
        res.status(403).json({ message: 'File is not a valid PNG' });
    }
});