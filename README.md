# Coding Challenge

Short command-line Node.js application for unqifiying a json array of objects.  

## Challenge Sumamry

Take a variable number of identically structured json records and de-duplicate the set.

An example file of records is given in the accompanying 'leads.json'. Output should be same format, with dups reconciled according to the following rules:

1. The data from the newest date should be preferred
2. duplicate IDs count as dups. Duplicate emails count as dups. Both must be unique in our dataset. Duplicate values elsewhere do not count as dups.
3. If the dates are identical the data from the record provided last in the list should be preferred

**Simplifying assumption:** the program can do everything in memory (don't worry about large files)

The application should also provide a log of changes including some representation of the source record, the output record and the individual field changes (value from and value to) for each field.

Please implement as a command-line java program, or a javascript program.

## Installation

Requires [Node.js](https://nodejs.org/) and [git](https://git-scm.com/)

```
> git clone https://github.com/WyrdNexus/Uniqify-CodeChallenge
> npm install
```

## Operation

```
Usage: <inputFile> [outputFile]
> node command.js ./data/leads.json [./data/unique_leads.json]
``` 
- **inputFile:** full or relative path to the sourse JSON file.
- **outputFile:** (optional) full or relative path of a directory for the resulting file.
    - defaults to the directory of the sourceFile.

### inputFile Requirements:
- Must be valid JSON.
- Must be UTF8 encoded.
- Must exist and be accessible by node.
- Must contain a property named 'leads' containing an array of objects
- leads objects must have:
    - _id
    - email
    - entryDate in [ISO9601](http://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.15) format

### outputFile Requirements:
- Must be an existing directory.
- Must be writable by node.
