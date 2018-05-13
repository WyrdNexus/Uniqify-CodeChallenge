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

    static prompt(msg, aryChoices, callback) {
        inquirer
            .prompt([{
                type: 'expand',
                message: msg+': ',
                choices: aryChoices
            }])
            .then(callback);
            // .then(answers => {
            //     console.log(JSON.stringify(answers, null, '  '));
            // });
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