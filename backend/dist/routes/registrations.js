"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Registration_1 = __importDefault(require("../models/Registration"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// 1. Submit a registration (Public)
router.post('/', async (req, res) => {
    try {
        const { fullName, mobileNumber, whatsAppNumber, email, gender, dateOfBirth, collegeName, university, department, year, district, city, whyJoin, areasOfInterest } = req.body;
        // Validation
        if (!fullName ||
            !mobileNumber ||
            !whatsAppNumber ||
            !email ||
            !gender ||
            !dateOfBirth ||
            !collegeName ||
            !university ||
            !department ||
            !year ||
            !district ||
            !city) {
            return res.status(400).json({ error: 'All required fields must be filled' });
        }
        const newRegistration = new Registration_1.default({
            fullName,
            mobileNumber,
            whatsAppNumber,
            email,
            gender,
            dateOfBirth,
            collegeName,
            university,
            department,
            year,
            district,
            city,
            whyJoin,
            areasOfInterest
        });
        const saved = await newRegistration.save();
        res.status(201).json({ message: 'Registration successful', data: saved });
    }
    catch (error) {
        console.error('Registration submission error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// 2. Get all registrations (Admin Auth, with filters and search)
router.get('/', auth_1.authenticateJWT, async (req, res) => {
    try {
        const { search, district, collegeName, department, page = '1', limit = '10' } = req.query;
        const query = {};
        // Filters
        if (district) {
            query.district = { $regex: new RegExp(String(district), 'i') };
        }
        if (collegeName) {
            query.collegeName = { $regex: new RegExp(String(collegeName), 'i') };
        }
        if (department) {
            query.department = { $regex: new RegExp(String(department), 'i') };
        }
        // Search
        if (search) {
            const searchRegex = new RegExp(String(search), 'i');
            query.$or = [
                { fullName: searchRegex },
                { email: searchRegex },
                { mobileNumber: searchRegex },
                { collegeName: searchRegex }
            ];
        }
        const p = parseInt(String(page), 10);
        const l = parseInt(String(limit), 10);
        const total = await Registration_1.default.countDocuments(query);
        const registrations = await Registration_1.default.find(query)
            .sort({ createdAt: -1 })
            .skip((p - 1) * l)
            .limit(l);
        res.json({
            total,
            page: p,
            limit: l,
            pages: Math.ceil(total / l),
            data: registrations
        });
    }
    catch (error) {
        console.error('Fetch registrations error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// 3. Export registrations to CSV (Admin Auth)
router.get('/export', auth_1.authenticateJWT, async (req, res) => {
    try {
        const registrations = await Registration_1.default.find().sort({ createdAt: -1 });
        // Define CSV Headers
        const headers = [
            'Full Name',
            'Mobile Number',
            'WhatsApp Number',
            'Email',
            'Gender',
            'Date of Birth',
            'College Name',
            'University',
            'Department',
            'Year',
            'District',
            'City',
            'Why Join',
            'Areas of Interest',
            'Registered Date'
        ];
        // Build CSV Row helper
        const escapeCSV = (val) => {
            if (val === null || val === undefined)
                return '';
            let str = String(val);
            // Escape quotes
            str = str.replace(/"/g, '""');
            // Wrap in quotes if it contains commas, quotes, or newlines
            if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
                str = `"${str}"`;
            }
            return str;
        };
        let csvContent = headers.join(',') + '\n';
        registrations.forEach((r) => {
            const dobStr = r.dateOfBirth ? new Date(r.dateOfBirth).toISOString().split('T')[0] : '';
            const createdStr = r.createdAt ? new Date(r.createdAt).toISOString() : '';
            const interestsStr = Array.isArray(r.areasOfInterest) ? r.areasOfInterest.join('; ') : '';
            const row = [
                escapeCSV(r.fullName),
                escapeCSV(r.mobileNumber),
                escapeCSV(r.whatsAppNumber),
                escapeCSV(r.email),
                escapeCSV(r.gender),
                escapeCSV(dobStr),
                escapeCSV(r.collegeName),
                escapeCSV(r.university),
                escapeCSV(r.department),
                escapeCSV(r.year),
                escapeCSV(r.district),
                escapeCSV(r.city),
                escapeCSV(r.whyJoin),
                escapeCSV(interestsStr),
                escapeCSV(createdStr)
            ];
            csvContent += row.join(',') + '\n';
        });
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=registrations_${Date.now()}.csv`);
        res.status(200).send(csvContent);
    }
    catch (error) {
        console.error('Export CSV error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
