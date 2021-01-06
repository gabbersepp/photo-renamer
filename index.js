
const log = require("./logger.js");
const { exit } = require("process");
const { readAllExif } = require("./exif.js");
const { rename } = require("./renamer.js");

if (process.argv.length <= 2) {
    log.error("you have to pass an path to a directory");
    exit(1);
}

async function asyncWrapper(path) {
    log.info(`begin processing: ${path}`)
    const exifs = await readAllExif(path);
    log.info(`read ${exifs.length} exif data`)
    const exifDict = {};
    exifs.forEach(e => exifDict[e.filePath] = e);
    await rename(path, exifDict);
}

asyncWrapper(process.argv[2]);