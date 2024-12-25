const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // เก็บรหัสผ่านดิบ
  role: { type: String, default: 'user' },
  created_at: { type: Date, default: Date.now },
});

// Exclude password from JSON response
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password; // ลบ password จากผลลัพธ์
        return ret;
    },
});

module.exports = mongoose.model('User', userSchema);
