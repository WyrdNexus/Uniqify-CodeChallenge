const AbstractTransform = require('./abstract_transform');

class LeadsTransform extends AbstractTransform
{
    // user-friendly name
    objectKeyName(obj) {
        return obj.email; // used for brevity
        //return '('+ obj._id +') '+ obj.email;
    }

    // mutate data, return desired
    transform(existingObj, newObject) {
        // todo: handle date-checking
        // todo: ensure overwrite of key-fields on new or eq date (WARN USER)
        return newObject;
    }

    // are these two instances of the same record?
    identify( objA, objB ) {
        return objB._id === objA._id || objB.email === objA.email;
    }
}

module.exports = LeadsTransform;