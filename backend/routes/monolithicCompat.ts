import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'tmm_super_secret_key_change_me';

// Middleware to require admin
const requireAdmin = (req: Request, res: Response, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (payload.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    (req as any).user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

// 1. Submit Registration (Public)
router.post('/register', async (req: Request, res: Response) => {
  try {
    const db = mongoose.connection.db;
    if (!db) {
      return res.status(500).json({ error: 'Database connection not ready' });
    }
    await db.collection('registrations').insertOne({ ...req.body, createdAt: new Date() });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Unable to save registration' });
  }
});

// 2. Submit Contact Message (Public)
router.post('/contact', async (req: Request, res: Response) => {
  try {
    const db = mongoose.connection.db;
    if (!db) {
      return res.status(500).json({ error: 'Database connection not ready' });
    }
    await db.collection('contacts').insertOne({ ...req.body, resolved: false, createdAt: new Date() });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Unable to save contact message' });
  }
});

// 3. Admin Login
router.post('/admin/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123';

    // Simple fallback check or db credentials check
    let authorized = (username === adminUser && password === adminPass);
    
    // Also support "admin" / "adminpassword" seeded in database
    if (!authorized) {
      const db = mongoose.connection.db;
      if (db) {
        const adminDoc = await db.collection('admins').findOne({ username });
        if (adminDoc) {
          const bcrypt = require('bcryptjs');
          const isMatch = await bcrypt.compare(password, adminDoc.passwordHash);
          if (isMatch) {
            authorized = true;
          }
        }
      }
    }

    if (!authorized) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ role: 'admin', username }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// 4. Admin Dashboard Stats
router.get('/admin/dashboard', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = mongoose.connection.db;
    if (!db) {
      return res.status(500).json({ error: 'Database connection not ready' });
    }
    const registrations = db.collection('registrations');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [total, todayCount, districtStats, collegeStats, recent] = await Promise.all([
      registrations.countDocuments(),
      registrations.countDocuments({ createdAt: { $gte: today } }),
      registrations.aggregate([{ $group: { _id: '$district', count: { $sum: 1 } } }, { $sort: { count: -1 } }]).toArray(),
      registrations.aggregate([{ $group: { _id: '$collegeName', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]).toArray(),
      registrations.find({}, { projection: { fullName: 1, collegeName: 1, district: 1, createdAt: 1 } }).sort({ createdAt: -1 }).limit(8).toArray(),
    ]);

    res.json({
      total,
      todayCount,
      districtStats,
      collegeStats,
      recent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to load dashboard stats' });
  }
});

// 5. Admin Registrations (Filter/CSV Export)
router.get('/admin/registrations', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { district, college, department, search, export: exportCsv } = req.query;

    const query: Record<string, any> = {};
    if (district) query.district = district;
    if (college) query.collegeName = college;
    if (department) query.department = department;
    if (search) {
      query.$or = [
        { fullName: { $regex: String(search), $options: 'i' } },
        { email: { $regex: String(search), $options: 'i' } },
        { mobileNumber: { $regex: String(search), $options: 'i' } },
        { collegeName: { $regex: String(search), $options: 'i' } },
      ];
    }

    const db = mongoose.connection.db;
    if (!db) {
      return res.status(500).json({ error: 'Database connection not ready' });
    }
    const items = await db.collection('registrations').find(query).sort({ createdAt: -1 }).toArray();

    if (exportCsv === 'csv') {
      const headers = ['Full Name', 'Mobile', 'Email', 'College', 'Department', 'District', 'Year', 'Created At'];
      const rows = items.map((item) =>
        [
          item.fullName,
          item.mobileNumber,
          item.email,
          item.collegeName,
          item.department,
          item.district,
          item.year,
          item.createdAt ? new Date(item.createdAt).toISOString() : '',
        ]
          .map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`)
          .join(',')
      );
      const csv = [headers.join(','), ...rows].join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=registrations.csv');
      return res.send(csv);
    }

    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to load registrations' });
  }
});

// 5a. Admin Create Registration
router.post('/admin/registrations', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = mongoose.connection.db;
    if (!db) {
      return res.status(500).json({ error: 'Database connection not ready' });
    }
    const result = await db.collection('registrations').insertOne({ ...req.body, createdAt: new Date() });
    res.json({ success: true, id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to create registration' });
  }
});

// 5b. Admin Update Registration
router.put('/admin/registrations/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Missing registration ID' });

    const db = mongoose.connection.db;
    if (!db) {
      return res.status(500).json({ error: 'Database connection not ready' });
    }

    const { _id, ...updateData } = req.body;
    const result = await db.collection('registrations').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to update registration' });
  }
});

// 5c. Admin Delete Registration
router.delete('/admin/registrations/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Missing registration ID' });

    const db = mongoose.connection.db;
    if (!db) {
      return res.status(500).json({ error: 'Database connection not ready' });
    }

    const result = await db.collection('registrations').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to delete registration' });
  }
});

// 6. Admin Contacts (Get/Mark Resolved)
router.get('/admin/contacts', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = mongoose.connection.db;
    if (!db) {
      return res.status(500).json({ error: 'Database connection not ready' });
    }
    const items = await db.collection('contacts').find({}).sort({ createdAt: -1 }).toArray();
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to load contact enquiries' });
  }
});

router.patch('/admin/contacts', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id, resolved } = req.body;
    const db = mongoose.connection.db;
    if (!db) {
      return res.status(500).json({ error: 'Database connection not ready' });
    }
    await db.collection('contacts').updateOne({ _id: new ObjectId(id) }, { $set: { resolved: Boolean(resolved) } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to update enquiry' });
  }
});

// 7. Admin Events (Get/Create/Delete)
router.get('/admin/events', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = mongoose.connection.db;
    if (!db) {
      return res.status(500).json({ error: 'Database connection not ready' });
    }
    const items = await db.collection('events').find({}).sort({ date: -1 }).toArray();
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to load events' });
  }
});

router.post('/admin/events', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = mongoose.connection.db;
    if (!db) {
      return res.status(500).json({ error: 'Database connection not ready' });
    }
    const result = await db.collection('events').insertOne({ ...req.body, createdAt: new Date() });
    res.json({ success: true, id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to create event' });
  }
});

router.delete('/admin/events', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Missing id' });

    const db = mongoose.connection.db;
    if (!db) {
      return res.status(500).json({ error: 'Database connection not ready' });
    }
    await db.collection('events').deleteOne({ _id: new ObjectId(String(id)) });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to delete event' });
  }
});

// 8. Admin Gallery (Get/Create/Delete)
router.get('/admin/gallery', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = mongoose.connection.db;
    if (!db) {
      return res.status(500).json({ error: 'Database connection not ready' });
    }
    const items = await db.collection('gallery').find({}).sort({ createdAt: -1 }).toArray();
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to load gallery' });
  }
});

router.post('/admin/gallery', requireAdmin, async (req: Request, res: Response) => {
  try {
    const db = mongoose.connection.db;
    if (!db) {
      return res.status(500).json({ error: 'Database connection not ready' });
    }
    const result = await db.collection('gallery').insertOne({ ...req.body, createdAt: new Date() });
    res.json({ success: true, id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to add gallery item' });
  }
});

router.delete('/admin/gallery', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Missing id' });

    const db = mongoose.connection.db;
    if (!db) {
      return res.status(500).json({ error: 'Database connection not ready' });
    }
    await db.collection('gallery').deleteOne({ _id: new ObjectId(String(id)) });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to delete gallery item' });
  }
});

export default router;
