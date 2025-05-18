const express = require("express");

const User = require("../models/user");
const Game = require("../models/Game");
const Ticket = require("../models/Ticket");
const Product = require("../models/Product");


const express = require("express");
const router = express.Router();

const Game = require("../models/Game");
const Product = require("../models/Product");
const Ticket = require("../models/Ticket");

// --- Games ---
// Шинэ тоглолт нэмэх
router.post("/games", async (req, res) => {
  try {
    const game = new Game(req.body);
    await game.save();
    res.status(201).json(game);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Тоглолтуудыг авах
router.get("/games", async (req, res) => {
  const games = await Game.find();
  res.json(games);
});

// --- Products ---
// Бараа нэмэх
router.post("/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Бараануудыг авах
router.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Бараа устгах
router.delete("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// --- Tickets ---
// Тасалбаруудыг авах
router.get("/tickets", async (req, res) => {
  const tickets = await Ticket.find().populate("gameId userId");
  res.json(tickets);
});

module.exports = router;
