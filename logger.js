const fs = require("fs");

const logToConsole = process.env.CONSOLELOG;

function log(type, msg) {
    msg = `${type} -- ${msg}\r\n`;
    fs.appendFileSync("./log.txt", msg);
    if (logToConsole) {
        console.log(msg);
    }
}

module.exports = {
    info: msg => log("info", msg),
    error: msg => log("error", msg)
}