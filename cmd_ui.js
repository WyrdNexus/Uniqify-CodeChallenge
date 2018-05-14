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
        inquirer
            .prompt([{
                type: 'list',
                name: pName,
                message: 'How would you like to proceed? ',
                choices: [
                    'Abort',
                    'View Transactions',
                    'View Output Data',
                    'Write Output File'
                ],
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

    static displayCollection(array) {

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