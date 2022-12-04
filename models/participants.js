const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ParticipantSchema = new schema({
  userId: { type: String },
  competitionId: { type: String },
  studentName: { type: String },
  district: { type: String },
  school: { type: String },
  class: { type: String },
  attachment: { type: String },
  createdAt: { type: Date },
});

module.exports = mongoose.model("Participants", ParticipantSchema);
// 636aa68e8b11c7d04c4f2cc8