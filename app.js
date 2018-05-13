const cmdUI = require('./cmd_ui');
const fileManager = require('./file_manager');
const { Uniqify, Result }= require('./uniqify');

class App
{
    static parseLeads(inputFile, outputFile) {
        fileManager.loadSource(inputFile, function(data){
            if (data.leads) {
                cmdUI.message('Uniqifying Leads Data');
                let cleanData = Uniqify.parseObjectArray(data.leads);
                console.log(cleanData.output);
                cmdUI.exit('Complete',0);
            }
        });
    }

    static error(msg) {
        cmdUI.error(msg);
    }

    static message(msg) {
        cmdUI.message(msg);
    }

    static prompt(msg, aryChoices, callback) {
        cmdUI.prompt(msg, aryChoices, callback);
    }

    static setExitHandler(handler) {
        cmdUI.setExitHandler(handler);
    }
}

module.exports = App;
