class SimpleDiff
{
    constructor(a, b) {
        this.diffs = {};
        for(let prop in a) {
            if (b[prop] && a[prop] !== b[prop]) {
                this.diffs[prop] = a[prop] +' > '+ b[prop]+ '\n';
            }
        }
    }
}

SimpleDiff.prototype.toString = function() {
    let result = '';
    for(let prop in this.diffs) {
        result += prop +': '+ this.diffs[prop] +',';
    }

    return result.substring(0, result.length - 1);
};

module.exports = SimpleDiff;