var ExifImage = require('exif').ExifImage;
const dir = require("./dir.js");
const fs = require("fs");
const log = require("./logger.js");

// this function will skip everything that is not jpeg or jpg
// and also filter out images that already have been read 
async function readAllExif(path) {
    const existingExifs = fs.readFileSync("./exifs.json").toString();
    const files = await dir.getFiles(path);
    const exifs = JSON.parse(existingExifs);
    const fileDict = {};
    exifs.forEach(e => fileDict[e.filePath] = true)

    for(var i = 0; i < files.length; i++) {
        var f = files[i];
        if (fileDict[f]) {
            continue;
        }
        let ending = f.substr(f.length - 4).toLowerCase();

        if (!(ending === ".jpg" || ending === "jpeg")) {
            continue;
        }
        const exif = await getExif(f);
        try {
            if (exif) {
                exif.filePath = f;
                exifs.push({
                    filePath: f,
                    modifyDate: exif.image.ModifyDate,
                    createDate: exif.exif.CreateDate
                });
            } else {
                exifs.push({
                    filePath: f
                })
            }
        } catch {}
    }

    fs.writeFileSync("./exifs.json", JSON.stringify(exifs));
    return exifs;
}

function getExif(image) {
    return new Promise(resolve => {
        try {
            new ExifImage({ image }, function (error, exifData) {
                if (error) {
                    log.error(error.message);
                    resolve(false)
                    return;
                }
                
                resolve(exifData);

            });
        } catch (error) {
            log.error(error.message);
            resolve(false);
        }
    })
}

module.exports = {
    readAllExif
}