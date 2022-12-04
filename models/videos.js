const mongoose = require('mongoose');
const schema = mongoose.Schema;

const VideoSchema = new schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    category: { type: String, required: true },
    trending: { type: Boolean },
    trending: { type: Boolean },
    thumbnail: {type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date }
});

module.exports = mongoose.model('Videos', VideoSchema);