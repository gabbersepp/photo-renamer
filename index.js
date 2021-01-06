var ExifImage = require('exif').ExifImage;
const dir = require("./dir.js");
const fs = require("fs");
const date = require('date-and-time');

async function readAllExif() {
    // read existing exifs to get paths
    // append to existing exifs -> read and merge into
    // filter out everything != jog jpeg
    const existingExifs = fs.readFileSync("./exifs.json").toString();
    const files = await dir.getFiles("\\\\biehlercloud.speedport.ip\\Public\\Backup\\Bilder");
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
}

async function doSth() {
    const files = await dir.getFiles("\\\\biehlercloud.speedport.ip\\Public\\Backup\\Bilder");
    const logs = [];

    for(var i = 0; i < files.length; i++) {
        var f = files[i];
        const exif = await getExif(f);
        let exifCreateDate = new Date();
        const fileCreationDate = fs.statSync(f).birthtime;

        if (exif) {
            var createdDate = exif.exif.CreateDate
            exifCreateDate = date.parse(createdDate, "YYYY:MM:DD HH:mm:ss", false);

            if (exifCreateDate.getFullYear() < 2008) {
                // avoid wrong conigured cameras
                logs.push("error in file: " + f);
            } else {
                logs.push(`rename: ${f}:  ${exif.exif.CreateDate.replace(/[:\s]/g, "-")}`)
            }
        }
    }

    fs.writeFile("./out.txt", logs.join("\r\n"));
}

function getExif(image) {
    return new Promise(resolve => {
        try {
            new ExifImage({ image }, function (error, exifData) {
                if (error) {
                    console.log('Error: '+error.message);
                    resolve(false)
                    return;
                }
                
                resolve(exifData); // Do something with your data!

            });
        } catch (error) {
            console.log('Error: ' + error.message);
            resolve(false);
        }
    })
}

readAllExif();