const inquirer = require('inquirer');

class CoreUI
{
    constructor() {
        this.ui = new inquirer.ui.BottomBar();
        this.msgCount = 0;
        this.messages = [];
        this.notify('Initializing...');
    }

    notify(msg) {
        this.msgCount++;
        this.messages.push(msg);
        this.ui.log.write(this.msgCount+')'+ msg);
    }

    log(msg) {
        this.msgCount++;
        this.messages.push(msg);
    }
}

const coreUI = new CoreUI();

class CmdUI
{
    static error(msg) {
        console.warn(msg);
        coreUI.log(msg);
    }

    static message(msg) {
        coreUI.notify(msg);
    }

    static promptUniqifyAction(handlers) {
        const pName = 'uniqify_action';
        let choices = [];
        for(let prop in handlers) {
            // uc first
            choices.push(prop.replace(/_/g,' ').replace(/^(.)|\s+(.)/g, function ($1) {
                return $1.toUpperCase()
            }));
        }

        inquirer
            .prompt([{
                type: 'list',
                name: pName,
                message: 'How would you like to proceed? ',
                choices: choices,
                filter: function(val) {
                    return val.toLowerCase().replace(/\s/g, '_');
                }
            }])
            .then(answer => {
                if (answer[pName] && handlers[answer[pName]]) {
                    handlers[answer[pName]]();
                } else {
                    throw new ReferenceError('Unhandled choice '+answer[pName]+' in cmdUI:'+ pName);
                }
            });
    }

    static details(transformDetailedOverview) {
        const padRight = (s, n) => s + ' '.repeat(n - s.length); // String.padEnd is missing from my v of Node!?

        for (let key in transformDetailedOverview) {
            let entry = transformDetailedOverview[key];

            console.log(
                '\n\n'+entry.source._id +' '+entry.message+'\n'+
                '--------------------------------------'
            );

            for( let prop in entry.source) {
                if (prop === 'entryDate' || prop === 'sourceKey') continue;
                let line = '    '+ padRight(prop, 20) +': ';
                if (entry.source[prop]) {
                    line += padRight(entry.source[prop], 20);

                    if (entry.output && entry.output[prop]) {
                        line += ' --> '+ entry.output[prop];
                    }
                }
                console.log(line);
            }
        }
    }

    static exit(msg, code = 99) {
        console.error(msg);
        coreUI.log(msg);
        if (typeof coreUI.exitApp === 'function') {
            coreUI.exitApp(code);
        }
    }

    static setExitHandler(handler) {
        coreUI.exitApp = handler;
    }
}

module.exports = CmdUI;