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
        if (!existingObj || !existingObj.entryDate) {
            return newObject;
        }

        const existDate = new Date(existingObj.entryDate);
        const newDate = new Date(newObject.entryDate);

        if (existDate - newDate <= 0) {
            return newObject;
        }

        return existingObj;
    }

    // are these two instances of the same record?
    identify( objA, objB ) {
        return objB._id === objA._id || objB.email === objA.email;
    }
}

module.exports = LeadsTransform;