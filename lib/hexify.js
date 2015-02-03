var Jimp = require('jimp'),
    tinycolor = require('tinycolor2'),
    _ = require('underscore');

var SOURCE_COLOR = tinycolor('#8bb9f2').toHsl();

var loadBackground = function(callback) {
    new Jimp('images/backgrounds/hex.png', function() {
        var hex = this;

        var hexData = Array.prototype.slice.call(hex.bitmap.data, 0);

        var hexWidth = hex.bitmap.width,
            hexHeight = hex.bitmap.height;

        callback({
            image: hex,
            data: hexData,
            width: hexWidth,
            height: hexHeight
        });
    });
};

var create = function(name, color, hex, options, callback) {
    var lightnessRatio = color.l / SOURCE_COLOR.l,
        saturationRatio = color.s / SOURCE_COLOR.s;

    new Jimp('images/uploads/'+name+'.png', function() {
        var icon = this;

        var adjustedWidth = options.iconWidth * options.scaling;
        icon.resize(adjustedWidth, adjustedWidth / icon.bitmap.width * icon.bitmap.height);

        var iconData = Array.prototype.slice.call(icon.bitmap.data, 0);

        var S = 512,
            w = icon.bitmap.width,
            h = icon.bitmap.height,
            l = Math.floor(S/2 - w/2),
            t = Math.floor(S/2 - h/2);

        var iconDataAt = function(x, y) {
            var i = (y * w + x) * 4;
            return iconData.slice(i, i+4);
        };

        hex.image.resize(hex.width, hex.height);
        hex.image.scan(0, 0, hex.width, hex.height, function (x, y, idx) {
            var clr = tinycolor({
                r: hex.data[idx],
                g: hex.data[idx+1],
                b: hex.data[idx+2]
            });

            var hsl = clr.toHsl();
            hsl.h = color.h;
            hsl.s = hsl.s * saturationRatio;
            hsl.l = hsl.l * lightnessRatio;
            var rgb = tinycolor(hsl).toRgb();

            hex.data[idx] = rgb.r;
            hex.data[idx+1] = rgb.g;
            hex.data[idx+2] = rgb.b;

            var tX = x - l,
                tY = y - t - options.verticalOffset;

            if( tX >= 0 && tX < w &&
                tY >= 0 && tY < h ) {

                var iD = iconDataAt(tX, tY);
                if(iD[3] > 0) {
                    var a = iD[3] / 255;

                    var r = hex.data[idx],
                        g = hex.data[idx+1],
                        b = hex.data[idx+2];

                    var rD = 255 - r,
                        gD = 255 - g,
                        bD = 255 - b;

                    hex.data[idx] = r + rD * a;
                    hex.data[idx+1] = g + gD * a;
                    hex.data[idx+2] = b + bD * a;
                    hex.data[idx+3] = 255;
                }
            }
        });

        hex.image.bitmap.data = hex.data;
        hex.image.write('images/icons/'+name+'.png', function() {
            setTimeout(callback, 5);
        });
    });
};

module.exports = function(name, color, options, callback) {
    color = tinycolor(color).toHsl();

    if(!arguments[3]) {
        callback = arguments[2];
        options = {};
    }

    options = _.extend({
        scaling: 1,
        iconWidth: 256,
        verticalOffset: -10
    }, callback);

    loadBackground(function(hex) {
        create(name, color, hex, options, callback);
    });
};