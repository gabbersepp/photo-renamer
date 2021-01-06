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
        let processDate;
        let failed = false;

        if (!exif || !exif.createDate) {
            log.error(`cannot find exif data for: ${f}`);
            // this is the best what we can do now
            // other option: parse filename. But this would require to specify a format for the directory
            // maybe in the future
            processDate = fs.statSync(f).birthtime;
            failed = true;
        } else {
            var createdDate = exif.createDate
            processDate = date.parse(createdDate, "YYYY:MM:DD HH:mm:ss", false);

            if (processDate.getFullYear() < 2008) {
                // avoid wrong conigured cameras
                log.error(`exif date (${exif.createDate}) is assumed to be wrong: ${f}`);
                processDate = fs.statSync(f).birthtime;
                failed = true;
            }
        }

        const newName = date.format(processDate, "YYYY-MM-DD-HH-mm-ss");

        log.info(`rename: ${f}: ${newName}`)

        if (failed) {
            log.logTo("info", `rename: ${f}: ${newName}`, "./noexif.txt")
        }
    }
}

module.exports = {
    rename
}