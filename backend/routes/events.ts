import express, { Response } from 'express';
import Event from '../models/Event';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// 1. Get all events (Public)
router.get('/', async (req, res) => {
  try {
    const { type } = req.query; // 'upcoming' or 'past'
    const query: any = {};
    if (type === 'upcoming' || type === 'past') {
      query.type = type;
    }

    const events = await Event.find(query).sort({ date: -1 });
    res.json(events);
  } catch (error: any) {
    console.error('Fetch events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Get event by ID (Public)
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error: any) {
    console.error('Fetch event by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. Create event (Admin Auth)
router.post('/', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { titleEn, titleTa, descriptionEn, descriptionTa, date, image, type } = req.body;

    if (!titleEn || !titleTa || !descriptionEn || !descriptionTa || !date || !type) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newEvent = new Event({
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
  } catch (error: any) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. Update event (Admin Auth)
router.put('/:id', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { titleEn, titleTa, descriptionEn, descriptionTa, date, image, type } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (titleEn) event.titleEn = titleEn;
    if (titleTa) event.titleTa = titleTa;
    if (descriptionEn) event.descriptionEn = descriptionEn;
    if (descriptionTa) event.descriptionTa = descriptionTa;
    if (date) event.date = new Date(date);
    if (image !== undefined) event.image = image;
    if (type) event.type = type;

    const updated = await event.save();
    res.json(updated);
  } catch (error: any) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 5. Delete event (Admin Auth)
router.delete('/:id', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error: any) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
