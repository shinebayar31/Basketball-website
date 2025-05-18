const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  seatNumber: String,
  qrCode: String, // QR кодын дата хадгалах (base64 эсвэл string)
  status: String, // used, unused гэх мэт
});

module.exports = mongoose.model("Ticket", ticketSchema);
