const SimpleDiff = require('./simple_diff');
const OVERVIEW_REM  = -1;
const OVERVIEW_OVER = 1;
const OVERVIEW_SAME = 0;


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

        // this.clean() adds a 'sourceKey' property to the objects
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
        if (!existingObj || !existingObj._id) {
            return newObject;
        }

        newObject._id = existingObj._id;
        return Object.assign(existingObj, newObject);
    }

    // return bool ( are these two records of the same object? )
    identify( objA, objB ) {
        return objA._id === objB._id;
    }

    clean(objectInstance, i) {
        let existing;
        let keyName = this.objectKeyName(objectInstance);
        let existingKey = this.findByIdentity(objectInstance); // calls child.identify
        if (existingKey >= 0) {
            existing = this.output[existingKey];
        }

        objectInstance = this.transform(existing, objectInstance); // eg.: child.transform
        objectInstance.sourceKey = existingKey;

        if (typeof existing === 'object') {
            // record event on source index
            // this.trackOverview(existingKey, objectInstance, OVERVIEW_REM);
            this.trackOverview(i, objectInstance, OVERVIEW_OVER);

            let log = 'Updated '+ keyName + '\n'+ new SimpleDiff(existing, objectInstance);

            // execute update transaction
            this.update(existingKey, existing, objectInstance);

            // log transaction
            return log;

        } else {
            // record event on source index
            this.trackOverview(i, objectInstance, OVERVIEW_SAME);

            // execute insert transaction
            this.insert(objectInstance);

            // log transaction
            return 'Added '+ keyName;
        }
    }

    findByIdentity(objA) {
        let main = this;
        return this.output.findIndex(function(objB, i){
            return main.identify(objA, objB);
        });
    }

    insert(data) {
        this.output.push(data);
    }

    update(key, tgt, data) {
        // todo: warn on overwrite of key-fields (_id, email) OOS for Challenge
        this.output[key] = Object.assign(tgt, data);
    }

    trackOverview(key, obj, action) {
        let message = '';
        switch (action) {
            case OVERVIEW_REM:  message = 'Duplicate Removed          :'; break;
            case OVERVIEW_OVER: message = 'Overwrote Prior Duplicate  :'; break;
            case OVERVIEW_SAME: message = 'Original Preserved         :'; break;
            default:            message = 'UNKNOWN ACTION             :'; break;
        }

        if (typeof this.overview[key] === 'undefined') {
            this.overview[key] = {
                source: obj,
            };
        } else {
            this.overview[key].output = obj;
        }

        this.overview[key].message = message + this.objectKeyName(obj);
        this.overview[key].state = action;

        if (action === OVERVIEW_OVER) {
            if (typeof this.overview[key].parent === 'number') {
                this.trackOverview(this.overview[key].parent, obj, OVERVIEW_REM);
            }

            if (typeof obj.sourceKey === 'number') {
                let parentKey = obj.sourceKey;
                delete obj.sourceKey;

                this.trackOverview(parentKey, obj, OVERVIEW_REM);
                this.overview[key].parent = parentKey;
            }
        }
    }
}

module.exports = AbstractTransform;