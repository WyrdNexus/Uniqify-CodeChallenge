const Transformations = require('./transform/transformations');

class Uniqify
{
    constructor(type, sourceArray) {
        if (typeof Transformations[type] !== 'function') {
            throw new TypeError('Transformation of type "'+type+'" not supported.');
        }

        this.transformedData = Transformations[type](sourceArray);
    }

    get output() {
        return this.transformedData.output;
    }

    get overview() {
        return this.transformedData.overview.map((entry) => {
            return entry.message;
        });
    }

    get detailedOverview() {

        return this.transformedData.overview;
    }

    get transactions() {
        return this.transformedData.transactions;
    }

    get source() {
        return this.transformedData.source;
    }
}

module.exports = Uniqify;