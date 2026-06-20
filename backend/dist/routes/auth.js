"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = __importDefault(require("../models/Admin"));
const router = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'tmm_super_secret_key_change_me';
// Admin Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        const admin = await Admin_1.default.findOne({ username });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, admin.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const token = jsonwebtoken_1.default.sign({ adminId: admin._id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            admin: {
                id: admin._id,
                username: admin.username
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
