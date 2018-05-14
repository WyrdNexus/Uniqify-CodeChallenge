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

    get changes() {
        return this.transformedData.changes;
    }

    get source() {
        return this.transformedData.source;
    }
}

module.exports = Uniqify;