"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const Gallery_1 = __importDefault(require("../models/Gallery"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Ensure uploads folder exists
const uploadDir = path_1.default.join(__dirname, '../../uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// Multer Config
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp|gif|mp4|webm/;
        const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
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
        const query = {};
        if (albumNameEn) {
            query.albumNameEn = albumNameEn;
        }
        const items = await Gallery_1.default.find(query).sort({ createdAt: -1 });
        res.json(items);
    }
    catch (error) {
        console.error('Fetch gallery items error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// 2. Upload media file (Admin Auth)
router.post('/upload', auth_1.authenticateJWT, upload.single('media'), async (req, res) => {
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
    }
    catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});
// 3. Create gallery item (Admin Auth)
router.post('/', auth_1.authenticateJWT, async (req, res) => {
    try {
        const { titleEn, titleTa, mediaUrl, mediaType, albumNameEn, albumNameTa } = req.body;
        if (!titleEn || !titleTa || !mediaUrl || !albumNameEn || !albumNameTa) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const newItem = new Gallery_1.default({
            titleEn,
            titleTa,
            mediaUrl,
            mediaType: mediaType || 'photo',
            albumNameEn,
            albumNameTa
        });
        const saved = await newItem.save();
        res.status(201).json(saved);
    }
    catch (error) {
        console.error('Create gallery item error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// 4. Delete gallery item (Admin Auth)
router.delete('/:id', auth_1.authenticateJWT, async (req, res) => {
    try {
        const item = await Gallery_1.default.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Gallery item not found' });
        }
        // Attempt to delete local file if it is stored locally
        if (item.mediaUrl.includes('/uploads/')) {
            const filename = item.mediaUrl.split('/uploads/')[1];
            const filePath = path_1.default.join(uploadDir, filename);
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
        }
        await Gallery_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Gallery item deleted successfully' });
    }
    catch (error) {
        console.error('Delete gallery item error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
