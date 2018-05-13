class SimpleDiff
{
    constructor(a, b) {
        this.diffs = {};
        for(let prop in a) {
            if (b[prop] && a[prop] !== b[prop]) {
                this.diffs[prop] = a[prop] +' > '+ b[prop];
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

class Result
{
    constructor(array) {
        this.clean = this.clean.bind(this);

        this.source = array;
        this.output = [];
        this.changes = this.source.map(this.clean);
    }

    clean(obj, i, source) {
        let keyName = '('+ obj._id +') '+ obj.email;
        let existing = this.identify(obj);
        if (typeof existing === 'object') {
            this.update(existing, obj);
            // todo: cleaner handling and reporting of diff
            return 'Updated '+ keyName + ' '+ new SimpleDiff(existing, obj);
        } else {
            this.insert(obj);
            return 'Added '+ keyName;
        }
    }

    identify(obj) {
        let match = this.output.find(function(el){
            return el._id === obj.id || el.email === obj.email;
        });

        return match || false;
    }

    insert(data) {
        this.output.push(data);
    }

    update(tgt, data) {
        // todo: update on newer or matching date
        // todo: warn on overwrite of key-fields (_id, email)
    }
}

class Uniqify
{
    static parseObjectArray(sourceArray)
    {
        return new Result(sourceArray);
    }
}

module.exports = {
    Uniqify,
    Result
};