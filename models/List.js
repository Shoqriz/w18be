const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

listSchema.index({ author: 1 });

const List = mongoose.model('List', listSchema);

module.exports = List;