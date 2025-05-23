const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');


// Registration endpoint
router.post('/register', async (req, res) => {
  const { username, phone, email, password } = req.body;

  try {
    if (!username || !phone || !email || !password) {
      return res.status(400).json({ error: "Бүх талбарыг бөглөнө үү!" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Имэйл формат буруу байна!" });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Имэйл бүртгэлтэй байна" });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Хэрэглэгчийн нэр бүртгэлтэй байна" });
    }

    // Check if phone already exists
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ error: "Утасны дугаар бүртгэлтэй байна" });
    }

    //const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      phone,
      email,
      password: password,
      //password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: "Амжилттай бүртгэгдлээ",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone
      }
    });
  } catch (err) {
    console.error("Бүртгэлийн алдаа:", err);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// Хэрэглэгчийн мэдээлэл шинэчлэх PUT /api/users/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { username, phone, email, password } = req.body;

  try {
    // Хэрэглэгч олж авна
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "Хэрэглэгч олдсонгүй" });
    }

    // Шинэ email, username, phone давхцал шалгах (өөр хэрэглэгчдэд байвал алдаа гаргана)
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ error: "Имэйл бүртгэлтэй байна" });
      }
      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Имэйл формат буруу байна!" });
      }
      user.email = email;
    }

    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({ error: "Хэрэглэгчийн нэр бүртгэлтэй байна" });
      }
      user.username = username;
    }

    if (phone && phone !== user.phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) {
        return res.status(400).json({ error: "Утасны дугаар бүртгэлтэй байна" });
      }
      user.phone = phone;
    }

    // Нууц үг шинэчлэгдэхэд bcrypt ашиглан хадгална
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Өөр бусад талбаруудыг мөн шинэчлэж болно...

    await user.save();

    res.json({
      message: "Мэдээлэл амжилттай шинэчлэгдлээ",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (err) {
    console.error("Мэдээлэл шинэчлэх алдаа:", err);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});


// Login endpoint
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ error: "Бүх талбарыг бөглөнө үү!" });
    }

    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });
    console.log('Олдсон хэрэглэгч:', user);

    if (!user) {
      return res.status(401).json({ error: "Хэрэглэгчийн нэр эсвэл нууц үг буруу" });
    }
    console.log('Орж ирсэн нууц үг:', password);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Хэрэглэгчийн нэр эсвэл нууц үг буруу" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: "Амжилттай нэвтэрлээ",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error("Нэвтрэх алдаа:", err);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

router.get('/test', (req, res) => {
  res.json({ message: 'Сайн байна уу ROUTE TEST!' });
});

module.exports = router;
