const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

router.get('/', async (req, res, next) => {
  try {
    const users = await User.find().select('-password'); // ไม่แสดง password
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); // ไม่แสดง password
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select(
      '-password'
    );
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // สร้างผู้ใช้ใหม่ในฐานข้อมูลโดยไม่เข้ารหัสรหัสผ่าน
      const newUser = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password, // เก็บรหัสผ่านดิบ
      });

      res.status(201).json({
        message: 'User registered successfully',
        user: { id: newUser._id, username: newUser.username, email: newUser.email },
      });
    } catch (error) {
      next(error);
    }
  }
);



router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // ค้นหาผู้ใช้จากฐานข้อมูล
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // เปรียบเทียบรหัสผ่านที่ผู้ใช้ป้อนเข้ากับรหัสผ่านในฐานข้อมูล
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // หากรหัสผ่านถูกต้อง ส่งข้อความยืนยันการเข้าสู่ระบบ
    res.json({ message: 'Login successful', email: user.email });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});




module.exports = router;
