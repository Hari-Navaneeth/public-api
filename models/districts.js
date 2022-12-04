const mongoose = require('mongoose');
const schema = mongoose.Schema;

const DistrictSchema = new schema({
    district: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    createdAt: { type: Date },
    updatedAt: { type: Date }
});

module.exports = mongoose.model('Districts', DistrictSchema);