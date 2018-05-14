const LeadsTransform = require('./leads_transform');

class Transformations
{
    static leads(data) {
        return new LeadsTransform(data);
    }
}

module.exports = Transformations;