const SimpleDiff = require('./simple_diff');

/**
 * AbstractTransform
 * Performs bulk of work via arg1.map(this.clean)
 *
 * Requires child objects to define two methods:
 *   identify( objA, objB )
 *      must return bool: are these the same object?
 *
 *   transform( existingObject, newMatchingObject )
 *      must return the final transformed and reconciled data for this record
 *
 * Operation
 *    Array arg1 . map( this.clean )
 *    this.clean
 *        uses child.identify to find an existing matching record
 *        calls child.transform( existing, new ) to restructure result data
 *
 *        upserts result into this.output[]
 *        tracks update changes in this.changes[]
 *
 */
class AbstractTransform
{
    constructor(array) {
        // Simulated Abstraction
        if (new.target === AbstractTransform) {
            throw new TypeError("Cannot instantiate abstract class AbstractTransform");
        }

        if (typeof new.target.prototype.transform !== 'function') {
            throw new TypeError("Child class of AbstractTransform is missing a required method: transform(existingObject, newMatchingObject)");
        }

        if (typeof new.target.prototype.identify !== 'function') {
            throw new TypeError("Child class of AbstractTransform is missing a required method: identify(objA, objB)");
        }

        // constructor
        this.clean = this.clean.bind(this);

        this.source = array;
        this.output = [];
        this.changes = this.source.map(this.clean);
    }

    // generate a user-friendly name for an object
    objectKeyName(obj) {
        return obj._id;
    }

    // mutate data as needed returning desired structure for this record
    transform(existingObj, newObject) {
        newObject._id = existingObj._id;
        return Object.assign(existingObj, newObject);
    }

    // return bool ( are these two records of the same object? )
    identify( objA, objB ) {
        return objA._id === objB._id;
    }

    clean(objectInstance) {
        let keyName = this.objectKeyName(objectInstance);
        let existing = this.findByIdentity(objectInstance); // calls child.identify
        objectInstance = this.transform(existing, objectInstance); // eg.: child.transform

        if (typeof existing === 'object') {
            this.update(existing, objectInstance);
            // todo: cleaner handling and reporting of diff
            return 'Updated '+ keyName + ' '+ new SimpleDiff(existing, objectInstance);
        } else {
            this.insert(objectInstance);
            return 'Added '+ keyName;
        }
    }

    findByIdentity(objA) {
        let main = this;
        let match = this.output.find(function(objB){
            return main.identify(objA, objB);
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

module.exports = AbstractTransform;