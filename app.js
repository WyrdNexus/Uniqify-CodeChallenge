const cmdUI = require('./cmd_ui');
const fileManager = require('./file_manager');
const Uniqify = require('./uniqify');
const indent = '    ';

class App
{
    static parseLeads(inputFile, outputFile) {
        fileManager.loadSource(inputFile, function(data){
            if (data.leads) {
                cmdUI.message('Uniqifying Leads Data');
                let uniqueResults = new Uniqify('leads', data.leads);

                const actions = {
                    abort: () => {
                        cmdUI.exit('Aborted', 0);
                    },
                    view_transactions: () => {
                        console.log(uniqueResults.transactions);
                        cmdUI.promptUniqifyAction(actions);
                    },
                    write_output_file: () => {
                        fileManager.writeResult(outputFile,uniqueResults.output);
                        cmdUI.exit('Complete', 0);
                    },
                };

                cmdUI.message(
                    '\n'+indent+'OVERVIEW of Actions on Source Data\n' +
                    indent+'==================================\n'+indent +
                    uniqueResults.overview.join('\n'+indent)
                );
                cmdUI.message(
                    '\n'+indent+'Resulting Emails in Data\n' +
                    indent+'========================\n' +
                    uniqueResults.output.map(function (el) {
                        return indent+el.email || indent+'EMAIL MISSING!';
                    }).join('\n')
                );
                cmdUI.promptUniqifyAction(actions);
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
