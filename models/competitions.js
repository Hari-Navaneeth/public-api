const mongoose = require("mongoose");
const schema = mongoose.Schema;

const CompetitionSchema = new schema({
  title: { type: String },
  tillDate: { type: Date },
  createdAt: { type: Date },
});

module.exports = mongoose.model("Competitions", CompetitionSchema);