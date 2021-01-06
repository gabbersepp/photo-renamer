const fs = require("fs");

const logToConsole = process.env.CONSOLELOG;

function log(type, msg, path) {
    msg = `${type} -- ${msg}\r\n`;
    fs.appendFileSync(path || "./log.txt", msg);
    if (logToConsole) {
        console.log(msg);
    }
}

module.exports = {
    info: msg => log("info", msg),
    error: msg => log("error", msg),
    logTo: (type, msg, path) => log(type, msg, path)
}