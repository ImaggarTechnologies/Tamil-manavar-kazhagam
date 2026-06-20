"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Event_1 = __importDefault(require("../models/Event"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// 1. Get all events (Public)
router.get('/', async (req, res) => {
    try {
        const { type } = req.query; // 'upcoming' or 'past'
        const query = {};
        if (type === 'upcoming' || type === 'past') {
            query.type = type;
        }
        const events = await Event_1.default.find(query).sort({ date: -1 });
        res.json(events);
    }
    catch (error) {
        console.error('Fetch events error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// 2. Get event by ID (Public)
router.get('/:id', async (req, res) => {
    try {
        const event = await Event_1.default.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    }
    catch (error) {
        console.error('Fetch event by ID error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// 3. Create event (Admin Auth)
router.post('/', auth_1.authenticateJWT, async (req, res) => {
    try {
        const { titleEn, titleTa, descriptionEn, descriptionTa, date, image, type } = req.body;
        if (!titleEn || !titleTa || !descriptionEn || !descriptionTa || !date || !type) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const newEvent = new Event_1.default({
            titleEn,
            titleTa,
            descriptionEn,
            descriptionTa,
            date: new Date(date),
            image,
            type
        });
        const saved = await newEvent.save();
        res.status(201).json(saved);
    }
    catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// 4. Update event (Admin Auth)
router.put('/:id', auth_1.authenticateJWT, async (req, res) => {
    try {
        const { titleEn, titleTa, descriptionEn, descriptionTa, date, image, type } = req.body;
        const event = await Event_1.default.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        if (titleEn)
            event.titleEn = titleEn;
        if (titleTa)
            event.titleTa = titleTa;
        if (descriptionEn)
            event.descriptionEn = descriptionEn;
        if (descriptionTa)
            event.descriptionTa = descriptionTa;
        if (date)
            event.date = new Date(date);
        if (image !== undefined)
            event.image = image;
        if (type)
            event.type = type;
        const updated = await event.save();
        res.json(updated);
    }
    catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// 5. Delete event (Admin Auth)
router.delete('/:id', auth_1.authenticateJWT, async (req, res) => {
    try {
        const deleted = await Event_1.default.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully' });
    }
    catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
