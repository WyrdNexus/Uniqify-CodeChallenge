const uniqify = require('./uniqify');

let exitHandler = null;

class App
{
    static parseLeads(inputFile, outputFile) {
        console.log(inputFile,outputFile);
        //todo: fileAccess
        //todo: uniqifyData
    }

    static exit(code) {
        if (typeof exitHandler === 'function') {
            exitHandler(code);
        }
    }

    static error(msg) {
        console.warn(msg);
    }

    static message(msg) {
        console.log(msg);
    }

    static setExitHandler(handler) {
        exitHandler = handler;
    }
}

module.exports = App;
