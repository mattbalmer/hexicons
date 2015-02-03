module.exports = {
    cleanFilename: function(filename) {
        if(filename.indexOf('.') > -1) {
            filename = filename.substring(0, filename.indexOf('.'));
        }

        filename = filename.replace(/\\/g, '').replace(/\//g, '')

        return filename;
    }
};