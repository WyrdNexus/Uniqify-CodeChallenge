const SimpleDiff = require('./simple_diff');
const STR_REM  = 'Duplicate Removed          :';
const STR_OVER = 'Overwrote Prior Duplicate  :';
const STR_SAME = 'Original Preserved         :';


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
 *        tracks inserts and updates transactions in this.transactions[]
 *        records action taken for each entry in arg1 in this.overview[]
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
        this.overview = [];
        this.transactions = this.source.map(this.clean);

        // clean adds a 'sourceKey' property to the objects
        // for use in creating the overview of changes to the source.
        // remove it before finishing.
        this.output.forEach(function(el){
            delete el.sourceKey;
        });
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

    clean(objectInstance, i) {
        let keyName = this.objectKeyName(objectInstance);
        let existing = this.findByIdentity(objectInstance); // calls child.identify
        objectInstance = this.transform(existing, objectInstance); // eg.: child.transform
        objectInstance.sourceKey = i;

        if (typeof existing === 'object') {
            // record event on source index
            this.overview[existing.sourceKey] = STR_REM + this.objectKeyName(existing);
            this.overview[i] = STR_OVER + this.objectKeyName(objectInstance);

            // execute update transaction
            this.update(existing, objectInstance);

            // log transaction
            // todo: cleaner handling and reporting of diff
            return 'Updated '+ keyName + ' '+ new SimpleDiff(existing, objectInstance);

        } else {
            // record event on source index
            this.overview[i] = STR_SAME + this.objectKeyName(objectInstance);

            // execute insert transaction
            this.insert(objectInstance);

            // log transaction
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