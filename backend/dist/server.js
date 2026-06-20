"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
// Load Env variables
dotenv_1.default.config();
// Import Models
const Admin_1 = __importDefault(require("./models/Admin"));
const Registration_1 = __importDefault(require("./models/Registration"));
const Event_1 = __importDefault(require("./models/Event"));
const Gallery_1 = __importDefault(require("./models/Gallery"));
const Enquiry_1 = __importDefault(require("./models/Enquiry"));
// Import Routes
const auth_1 = __importDefault(require("./routes/auth"));
const registrations_1 = __importDefault(require("./routes/registrations"));
const events_1 = __importDefault(require("./routes/events"));
const gallery_1 = __importDefault(require("./routes/gallery"));
const enquiries_1 = __importDefault(require("./routes/enquiries"));
const monolithicCompat_1 = __importDefault(require("./routes/monolithicCompat"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tmm';
// Express Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve Static Uploads
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/registrations', registrations_1.default);
app.use('/api/events', events_1.default);
app.use('/api/gallery', gallery_1.default);
app.use('/api/enquiries', enquiries_1.default);
app.use('/api', monolithicCompat_1.default);
// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', database: mongoose_1.default.connection.readyState === 1 ? 'Connected' : 'Disconnected' });
});
// Seed Initial Admin & Demo Data if Database is Empty
const seedDemoData = async () => {
    try {
        const adminCount = await Admin_1.default.countDocuments();
        if (adminCount === 0) {
            console.log('Seeding demo data...');
            // 1. Create Default Admin
            const passwordHash = await bcryptjs_1.default.hash('adminpassword', 10);
            const defaultAdmin = new Admin_1.default({
                username: 'admin',
                passwordHash
            });
            await defaultAdmin.save();
            console.log('✔ Default Admin Created: admin / adminpassword');
            // 2. Create Demo Registrations
            const demoRegs = [
                {
                    fullName: 'Karthik Raja',
                    mobileNumber: '9876543210',
                    whatsAppNumber: '9876543210',
                    email: 'karthik@gmail.com',
                    gender: 'Male',
                    dateOfBirth: new Date('2004-05-15'),
                    collegeName: 'Madras Christian College',
                    university: 'Madras University',
                    department: 'B.Sc. Computer Science',
                    year: 'III Year',
                    district: 'Chennai',
                    city: 'Tambaram',
                    whyJoin: 'I want to build my leadership skills and work for Tamil community development.',
                    areasOfInterest: ['Leadership', 'Event Management', 'Technical Team']
                },
                {
                    fullName: 'Anitha Selvam',
                    mobileNumber: '8765432109',
                    whatsAppNumber: '8765432109',
                    email: 'anitha@yahoo.com',
                    gender: 'Female',
                    dateOfBirth: new Date('2005-08-22'),
                    collegeName: 'PSG College of Technology',
                    university: 'Anna University',
                    department: 'B.E. EEE',
                    year: 'II Year',
                    district: 'Coimbatore',
                    city: 'Peelamedu',
                    whyJoin: 'Interested in volunteering for social service projects and cultural programs.',
                    areasOfInterest: ['Social Service', 'Public Speaking', 'Tamil Literature']
                },
                {
                    fullName: 'Senthil Kumar',
                    mobileNumber: '7654321098',
                    whatsAppNumber: '7654321098',
                    email: 'senthil@gmail.com',
                    gender: 'Male',
                    dateOfBirth: new Date('2003-12-10'),
                    collegeName: 'American College',
                    university: 'Madurai Kamaraj University',
                    department: 'B.A. Tamil Literature',
                    year: 'III Year',
                    district: 'Madurai',
                    city: 'Goripalayam',
                    whyJoin: 'Deeply passionate about Tamil history and public speaking competitions.',
                    areasOfInterest: ['Tamil Literature', 'Public Speaking', 'Media Team']
                }
            ];
            await Registration_1.default.insertMany(demoRegs);
            console.log('✔ Seeded 3 Demo Student Registrations');
            // 3. Create Demo Events
            const demoEvents = [
                {
                    titleEn: 'State Level Tamil Debate Competition 2026',
                    titleTa: 'மாநில அளவிலான தமிழ் பட்டிமன்றம் 2026',
                    descriptionEn: 'Join us for the grand Tamil debate competition featuring speakers from over 50 colleges across Tamil Nadu.',
                    descriptionTa: 'தமிழகம் முழுவதும் உள்ள 50-க்கும் மேற்பட்ட கல்லூரிகளின் பேச்சாளர்கள் பங்கேற்கும் பிரம்மாண்ட பட்டிமன்றம்.',
                    date: new Date('2026-07-15'),
                    image: '',
                    type: 'upcoming'
                },
                {
                    titleEn: 'Leadership and Skill Training Seminar',
                    titleTa: 'தலைமைப் பண்பு மற்றும் திறன் பயிற்சி கருத்தரங்கு',
                    descriptionEn: 'A weekend workshop designed to empower student leaders and build communication and public speaking skills.',
                    descriptionTa: 'மாணவ தலைவர்களை உருவாக்கவும், பேச்சாற்றல் மற்றும் தகவல் தொடர்பு திறன்களை வளர்க்கவும் வார இறுதிப் பயிலரங்கம்.',
                    date: new Date('2026-06-25'),
                    image: '',
                    type: 'upcoming'
                },
                {
                    titleEn: 'Tamil Language Awareness Rally',
                    titleTa: 'தமிழ் மொழி விழிப்புணர்வு பேரணி',
                    descriptionEn: 'Our members successfully organized a street rally advocating the preservation and enrichment of Tamil language education.',
                    descriptionTa: 'தமிழ் மொழி கல்வியைப் பாதுகாக்கவும் வளர்க்கவும் வலியுறுத்தி நமது உறுப்பினர்கள் நடத்திய விழிப்புணர்வு பேரணி.',
                    date: new Date('2026-05-10'),
                    image: '',
                    type: 'past'
                }
            ];
            await Event_1.default.insertMany(demoEvents);
            console.log('✔ Seeded 3 Demo Events');
            // 4. Create Demo Gallery Items
            const demoGallery = [
                {
                    titleEn: 'Annual Student Meet 2025 Group Photo',
                    titleTa: 'ஆண்டு மாணவர் சந்திப்பு 2025 குழுப் புகைப்படம்',
                    mediaUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=60',
                    mediaType: 'photo',
                    albumNameEn: 'Annual Meets',
                    albumNameTa: 'ஆண்டு சந்திப்புகள்'
                },
                {
                    titleEn: 'Social Service Tree Plantation Drive',
                    titleTa: 'சமூக சேவை மரக்கன்று நடும் விழா',
                    mediaUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60',
                    mediaType: 'photo',
                    albumNameEn: 'Social Service',
                    albumNameTa: 'சமூக சேவை'
                },
                {
                    titleEn: 'Debate Competitions Winner Trophy Ceremony',
                    titleTa: 'பட்டிமன்றப் போட்டிகளின் வெற்றி கோப்பை வழங்கும் விழா',
                    mediaUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60',
                    mediaType: 'photo',
                    albumNameEn: 'Competitions',
                    albumNameTa: 'போட்டிகள்'
                },
                {
                    titleEn: 'Laptop Award Ceremony',
                    titleTa: 'மாணவர்களுக்கு மடிக்கணினி வழங்கும் விழா',
                    mediaUrl: '/uploads/img1.jpg',
                    mediaType: 'photo',
                    albumNameEn: 'Student Awards',
                    albumNameTa: 'மாணவர் விருதுகள்'
                },
                {
                    titleEn: 'Skill Scheme Inauguration',
                    titleTa: 'திறன் மேம்பாட்டு திட்ட தொடக்க விழா',
                    mediaUrl: '/uploads/img2.jpg',
                    mediaType: 'photo',
                    albumNameEn: 'Inaugurations',
                    albumNameTa: 'தொடக்க விழாக்கள்'
                },
                {
                    titleEn: 'Outreach and Training Video',
                    titleTa: 'விழிப்புணர்வு மற்றும் பயிற்சி வீடியோ',
                    mediaUrl: 'https://youtu.be/sLbv_z2oNuI?si=Pc2ALDvVRVAT3nqm',
                    mediaType: 'video',
                    albumNameEn: 'Outreach & Training',
                    albumNameTa: 'விழிப்புணர்வு & பயிற்சி'
                }
            ];
            await Gallery_1.default.insertMany(demoGallery);
            console.log('✔ Seeded 6 Demo Gallery Items');
            // 5. Create Demo Enquiries
            const demoEnquiries = [
                {
                    name: 'Ramesh Krishnan',
                    email: 'ramesh.k@gmail.com',
                    phone: '9876501234',
                    message: 'Hello, how can our college set up a local student chapter of Tamil Maanavar Mandram?',
                    status: 'pending'
                },
                {
                    name: 'Dr. Meena',
                    email: 'meena.prof@college.edu',
                    phone: '9443214567',
                    message: 'We would like to invite your representatives for our upcoming Tamil literary association guest lecture.',
                    status: 'resolved'
                }
            ];
            await Enquiry_1.default.insertMany(demoEnquiries);
            console.log('✔ Seeded 2 Demo Enquiries');
        }
    }
    catch (err) {
        console.error('Error seeding demo data:', err);
    }
};
// Connect to MongoDB
const startServer = async () => {
    try {
        console.log(`Attempting to connect to MongoDB at ${MONGO_URI}...`);
        await mongoose_1.default.connect(MONGO_URI, { serverSelectionTimeoutMS: 4000 });
        console.log('Successfully connected to MongoDB Database.');
        await seedDemoData();
    }
    catch (err) {
        console.log('Local MongoDB connection failed. Starting MongoMemoryServer as fallback...');
        try {
            const mongod = await mongodb_memory_server_1.MongoMemoryServer.create({
                instance: {
                    port: 27017
                }
            });
            const uri = mongod.getUri();
            console.log(`MongoMemoryServer started at: ${uri}`);
            await mongoose_1.default.connect(uri);
            console.log('Successfully connected to in-memory MongoDB Database.');
            await seedDemoData();
        }
        catch (innerErr) {
            console.error('Failed to start in-memory MongoDB:', innerErr);
            console.log('Shutting down server due to database failure...');
            process.exit(1);
        }
    }
    app.listen(PORT, () => {
        console.log(`Backend server is running on port ${PORT}`);
    });
};
startServer();
