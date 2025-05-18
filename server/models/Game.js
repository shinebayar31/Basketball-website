const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  teamA: String,
  teamB: String,
  date: Date,
  location: String,
  price: Number,
});

module.exports = mongoose.model("Game", gameSchema);
