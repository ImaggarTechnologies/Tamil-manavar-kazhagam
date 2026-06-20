import express, { Response } from 'express';
import Enquiry from '../models/Enquiry';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// 1. Submit contact enquiry (Public)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newEnquiry = new Enquiry({
      name,
      email,
      phone,
      message
    });

    const saved = await newEnquiry.save();
    res.status(201).json({ message: 'Enquiry submitted successfully', data: saved });
  } catch (error: any) {
    console.error('Enquiry submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Get all enquiries (Admin Auth)
router.get('/', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error: any) {
    console.error('Fetch enquiries error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. Mark enquiry as resolved (Admin Auth)
router.put('/:id/resolve', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    enquiry.status = 'resolved';
    const updated = await enquiry.save();
    res.json(updated);
  } catch (error: any) {
    console.error('Resolve enquiry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
