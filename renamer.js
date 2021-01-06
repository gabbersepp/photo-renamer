const dir = require("./dir.js");
const fs = require("fs");
const date = require('date-and-time');
const log = require("./logger.js");

// exifs = { [path: string]: exif }
async function rename(path, exifs) {
    const files = await dir.getFiles(path);

    for(var i = 0; i < files.length; i++) {
        var f = files[i];
        const exif = exifs[f];

        if (!exif) {
            log.error(`cannot find exif data for: ${f}`)
        }

        let exifcreateDate = new Date();
        //const fileCreationDate = fs.statSync(f).birthtime;

        if (exif && exif.createDate) {
            var createdDate = exif.createDate
            exifcreateDate = date.parse(createdDate, "YYYY:MM:DD HH:mm:ss", false);

            if (exifcreateDate.getFullYear() < 2008) {
                // avoid wrong conigured cameras
                log.error("error in file: " + f);
            } else {
                log.info(`rename: ${f}:  ${exif.createDate.replace(/[:\s]/g, "-")}`)
            }
        } else if (exif) {
            log.error(`cannot rename based on exif: ${f}`)
        }
    }
}

module.exports = {
    rename
}