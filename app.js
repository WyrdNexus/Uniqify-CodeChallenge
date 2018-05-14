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

                // Initial Report of Results
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

                // handler methods for prompt choices
                const actions = {
                    abort: () => {
                        cmdUI.exit('Aborted', 0);
                    },
                    view_transactions: () => {
                        cmdUI.message(
                            '\n'+indent+'Transactions on Source Data\n' +
                            indent+'==================================\n'+
                            uniqueResults.transactions.join('\n\n')
                        );
                        cmdUI.promptUniqifyAction(actions);
                    },
                    view_output_data: () => {
                        cmdUI.message(JSON.stringify({leads: uniqueResults.output}, null, 4));
                        cmdUI.promptUniqifyAction(actions);
                    },
                    write_output_file: () => {
                        const finalData = {
                            leads: uniqueResults.output
                        };
                        fileManager.writeResult(outputFile,finalData, function(){
                            cmdUI.exit('Complete', 0);
                        });
                    },
                };

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

    static setExitHandler(handler) {
        cmdUI.setExitHandler(handler);
    }
}

module.exports = App;
