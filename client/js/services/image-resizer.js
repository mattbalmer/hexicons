module.exports = function(dataUri, size, callback) {

    var image = new Image();
    image.onload = function () {

        var canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d");
        canvas.width = image.width;
        canvas.height = image.height;

        /// step 1 - resize to 50%
        var oc = document.createElement('canvas'),
            octx = oc.getContext('2d');

        oc.width = image.width * 0.5;
        oc.height = image.height * 0.5;
        octx.drawImage(image, 0, 0, oc.width, oc.height);

        /// step 2 - resize 50% of step 1
        octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);

        /// step 3, resize to final size
        ctx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5,
            0, 0, canvas.width, canvas.height);

        callback(canvas.toDataURL('image/png'));
    };

    image.src = dataUri;
};
