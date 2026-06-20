"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Enquiry_1 = __importDefault(require("../models/Enquiry"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// 1. Submit contact enquiry (Public)
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !phone || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const newEnquiry = new Enquiry_1.default({
            name,
            email,
            phone,
            message
        });
        const saved = await newEnquiry.save();
        res.status(201).json({ message: 'Enquiry submitted successfully', data: saved });
    }
    catch (error) {
        console.error('Enquiry submission error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// 2. Get all enquiries (Admin Auth)
router.get('/', auth_1.authenticateJWT, async (req, res) => {
    try {
        const enquiries = await Enquiry_1.default.find().sort({ createdAt: -1 });
        res.json(enquiries);
    }
    catch (error) {
        console.error('Fetch enquiries error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// 3. Mark enquiry as resolved (Admin Auth)
router.put('/:id/resolve', auth_1.authenticateJWT, async (req, res) => {
    try {
        const enquiry = await Enquiry_1.default.findById(req.params.id);
        if (!enquiry) {
            return res.status(404).json({ error: 'Enquiry not found' });
        }
        enquiry.status = 'resolved';
        const updated = await enquiry.save();
        res.json(updated);
    }
    catch (error) {
        console.error('Resolve enquiry error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
