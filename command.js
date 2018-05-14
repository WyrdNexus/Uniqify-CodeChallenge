const program = require('commander');
const app = require('./app');
const defaultOutputFile = 'unique_leads.json';

program
    .version(require('./package.json').version)
    .description(require('./package.json').description)
    .arguments('<inputFile> [outputFile]')
    .action((inputFile, outputFile) => {
        inputPath = inputFile;
        outputPath = outputFile || inputFile.substring(0,inputFile.lastIndexOf("/")+1) + defaultOutputFile;
    });

program.parse(process.argv);

if (typeof inputPath === 'undefined') {
    app.error('Required Argument Missing: inputFile.\nPlease see help (-h) for this command.');
    process.exit(1);
}

app.setExitHandler(process.exit);
app.message('Starting Leads Parsing');
app.parseLeads(inputPath, outputPath);