import express, { Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Gallery from '../models/Gallery';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif|mp4|webm/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images and videos are allowed!'));
  }
});

// 1. Get all gallery items (Public)
router.get('/', async (req, res) => {
  try {
    const { albumNameEn } = req.query;
    const query: any = {};
    if (albumNameEn) {
      query.albumNameEn = albumNameEn;
    }

    const items = await Gallery.find(query).sort({ createdAt: -1 });
    res.json(items);
  } catch (error: any) {
    console.error('Fetch gallery items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Upload media file (Admin Auth)
router.post('/upload', authenticateJWT, upload.single('media'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Build static URL to access the uploaded file
    const host = req.get('host');
    const protocol = req.protocol;
    const mediaUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    res.json({
      mediaUrl,
      filename: req.file.filename
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// 3. Create gallery item (Admin Auth)
router.post('/', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { titleEn, titleTa, mediaUrl, mediaType, albumNameEn, albumNameTa } = req.body;

    if (!titleEn || !titleTa || !mediaUrl || !albumNameEn || !albumNameTa) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newItem = new Gallery({
      titleEn,
      titleTa,
      mediaUrl,
      mediaType: mediaType || 'photo',
      albumNameEn,
      albumNameTa
    });

    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (error: any) {
    console.error('Create gallery item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. Delete gallery item (Admin Auth)
router.delete('/:id', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    // Attempt to delete local file if it is stored locally
    if (item.mediaUrl.includes('/uploads/')) {
      const filename = item.mediaUrl.split('/uploads/')[1];
      const filePath = path.join(uploadDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error: any) {
    console.error('Delete gallery item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
