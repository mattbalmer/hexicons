function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

module.exports = function(file) {
    var blob = dataURItoBlob(file.content);

    if (typeof window.navigator.msSaveBlob !== 'undefined') {
        window.navigator.msSaveBlob(blob, file.name);
    } else {
        var URL = window.URL || window.webkitURL;
        var downloadUrl = URL.createObjectURL(blob);

        console.log('downloadurl', downloadUrl);
        var a = document.createElement("a");
        if (typeof a.download === 'undefined') {
            window.location = downloadUrl;
        } else {
            a.href = downloadUrl;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
        }

        setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
    }
};