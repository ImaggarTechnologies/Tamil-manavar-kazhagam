import express, { Response } from 'express';
import Registration from '../models/Registration';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// 1. Submit a registration (Public)
router.post('/', async (req, res) => {
  try {
    const {
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
    } = req.body;

    // Validation
    if (
      !fullName ||
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
      !city
    ) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    const newRegistration = new Registration({
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
  } catch (error: any) {
    console.error('Registration submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Get all registrations (Admin Auth, with filters and search)
router.get('/', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { search, district, collegeName, department, page = '1', limit = '10' } = req.query;

    const query: any = {};

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

    const total = await Registration.countDocuments(query);
    const registrations = await Registration.find(query)
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
  } catch (error: any) {
    console.error('Fetch registrations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. Export registrations to CSV (Admin Auth)
router.get('/export', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });

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
    const escapeCSV = (val: any) => {
      if (val === null || val === undefined) return '';
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
  } catch (error: any) {
    console.error('Export CSV error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
