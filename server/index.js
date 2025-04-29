const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB холболт
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB холбогдлоо"))
  .catch(err => console.error("❌ Холбогдож чадсангүй:", err));

// Routes
app.use('/api', require('./routes/auth')); // энд auth route-г холбоно

// Sample API
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Сайн байна уу!' });
});

// Сервер асаах
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер ${PORT} порт дээр ажиллаж байна`));
