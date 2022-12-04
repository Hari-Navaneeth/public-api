const mongoose = require('mongoose');
const schema = mongoose.Schema;

const SchoolSchema = new schema ({
  schoolName: { type: String, required: true },
  district: { type: String, required: true },
  createdAt: { type: Date },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('Schools', SchoolSchema);