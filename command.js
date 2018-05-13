const program = require('commander');
const app = require('./app');

program
    .version(require('./package.json').version)
    .description(require('./package.json').description)
    .arguments('<inputFile> [outputFile]')
    .action((inputFile, outputFile) => {
        inputPath = inputFile;
        outputPath = outputFile;
    });

program.parse(process.argv);

if (typeof inputPath === 'undefined') {
    app.error('Required Argument Missing: inputFile.\nPlease see help (-h) for this command.');
    process.exit(1);
}

app.message('Start');
app.parseLeads(inputPath, outputPath);
app.message('Complete');