const cmdUI = require('./cmd_ui');
const fs = require('fs');

class FileManager
{
    static loadSource(path, dataHandler) {
        fs.readFile(path, 'utf8', function(err, data) {
            if (err) {
                cmdUI.exit(err.message || 'Unknown Error accessing file.');
                return;
            }

            try {
                cmdUI.message('Loading Data From '+ path);
                dataHandler(JSON.parse(data));
            } catch (e) {
                cmdUI.exit(e.message || 'Error parsing file data.');
            }
        });
    }

    static writeResult(path, data) {

    }
}

module.exports = FileManager;

