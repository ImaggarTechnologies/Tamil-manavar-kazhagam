import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Load Env variables
dotenv.config();

// Import Models
import Admin from './models/Admin';
import Registration from './models/Registration';
import Event from './models/Event';
import Gallery from './models/Gallery';
import Enquiry from './models/Enquiry';

// Import Routes
import authRoutes from './routes/auth';
import registrationRoutes from './routes/registrations';
import eventRoutes from './routes/events';
import galleryRoutes from './routes/gallery';
import enquiryRoutes from './routes/enquiries';
import monolithicCompatRoutes from './routes/monolithicCompat';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tmm';

// Express Middlewares
app.use(cors());
app.use(express.json());

// Serve Static Uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api', monolithicCompatRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected' });
});

// Seed Initial Admin & Demo Data if Database is Empty
const seedDemoData = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log('Seeding demo data...');

      // 1. Create Default Admin
      const passwordHash = await bcrypt.hash('adminpassword', 10);
      const defaultAdmin = new Admin({
        username: 'admin',
        passwordHash
      });
      await defaultAdmin.save();
      console.log('✔ Default Admin Created: admin / adminpassword');

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
          year: '3',
          district: 'Chennai',
          city: 'Tambaram',
          whyJoin: 'I want to build my leadership skills and work for Tamil community development.',
          areasOfInterest: ['Leadership', 'Event Management', 'Technical Team'],
          createdAt: new Date('2026-06-01')
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
          year: '2',
          district: 'Coimbatore',
          city: 'Peelamedu',
          whyJoin: 'Interested in volunteering for social service projects and cultural programs.',
          areasOfInterest: ['Social Service', 'Public Speaking', 'Tamil Literature'],
          createdAt: new Date('2026-06-02')
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
          year: '3',
          district: 'Madurai',
          city: 'Goripalayam',
          whyJoin: 'Deeply passionate about Tamil history and public speaking competitions.',
          areasOfInterest: ['Tamil Literature', 'Public Speaking', 'Media Team'],
          createdAt: new Date('2026-06-03')
        },
        {
          fullName: 'Ramya Krishnan',
          mobileNumber: '9444123456',
          whatsAppNumber: '9444123456',
          email: 'ramya.k@gmail.com',
          gender: 'Female',
          dateOfBirth: new Date('2004-11-05'),
          collegeName: 'Stella Maris College',
          university: 'Madras University',
          department: 'B.Com. General',
          year: '3',
          district: 'Chennai',
          city: 'Nungambakkam',
          whyJoin: 'To connect with other Tamil students and engage in active social service programs.',
          areasOfInterest: ['Social Service', 'Event Management'],
          createdAt: new Date('2026-06-04')
        },
        {
          fullName: 'Vigneshwaran S.',
          mobileNumber: '9845098765',
          whatsAppNumber: '9845098765',
          email: 'vignesh.s@gmail.com',
          gender: 'Male',
          dateOfBirth: new Date('2005-04-20'),
          collegeName: 'College of Engineering, Guindy',
          university: 'Anna University',
          department: 'B.Tech. Information Technology',
          year: '2',
          district: 'Chennai',
          city: 'Guindy',
          whyJoin: 'To coordinate technical events and build an online platform for Tamil student network.',
          areasOfInterest: ['Technical Team', 'Leadership'],
          createdAt: new Date('2026-06-05')
        },
        {
          fullName: 'Divya Bharathi',
          mobileNumber: '9003124578',
          whatsAppNumber: '9003124578',
          email: 'divya.b@gmail.com',
          gender: 'Female',
          dateOfBirth: new Date('2006-01-12'),
          collegeName: 'Loyola College',
          university: 'Madras University',
          department: 'B.Sc. Mathematics',
          year: '1',
          district: 'Thiruvallur',
          city: 'Avadi',
          whyJoin: 'I am keen to participate in cultural meets and Tamil literature debates.',
          areasOfInterest: ['Tamil Literature', 'Public Speaking'],
          createdAt: new Date('2026-06-06')
        },
        {
          fullName: 'Naveen Kumar R.',
          mobileNumber: '8124567890',
          whatsAppNumber: '8124567890',
          email: 'naveen.r@gmail.com',
          gender: 'Male',
          dateOfBirth: new Date('2003-09-30'),
          collegeName: 'St. Joseph\'s College',
          university: 'Bharathidasan University',
          department: 'B.Sc. Physics',
          year: '3',
          district: 'Tiruchirappalli',
          city: 'Chinthamani',
          whyJoin: 'To improve student involvement in environmental and green energy initiatives in Tamil Nadu.',
          areasOfInterest: ['Social Service', 'Leadership', 'Event Management'],
          createdAt: new Date('2026-06-07')
        },
        {
          fullName: 'Priya Dharshini',
          mobileNumber: '9566123450',
          whatsAppNumber: '9566123450',
          email: 'priyadharshini@gmail.com',
          gender: 'Female',
          dateOfBirth: new Date('2005-02-18'),
          collegeName: 'Government College of Technology',
          university: 'Anna University',
          department: 'B.E. Civil Engineering',
          year: '2',
          district: 'Coimbatore',
          city: 'Thadagam Road',
          whyJoin: 'To organize inter-college youth festivals celebrating traditional Tamil art forms.',
          areasOfInterest: ['Tamil Literature', 'Event Management', 'Media Team'],
          createdAt: new Date('2026-06-08')
        },
        {
          fullName: 'Arun Pandian',
          mobileNumber: '9894123456',
          whatsAppNumber: '9894123456',
          email: 'arun.pandian@outlook.com',
          gender: 'Male',
          dateOfBirth: new Date('2004-07-25'),
          collegeName: 'Thiagarajar College of Engineering',
          university: 'Anna University',
          department: 'B.E. Mechanical Engineering',
          year: '3',
          district: 'Madurai',
          city: 'Thiruparankundram',
          whyJoin: 'Interested in structural organization, youth mobilization, and community development.',
          areasOfInterest: ['Leadership', 'Event Management'],
          createdAt: new Date('2026-06-09')
        },
        {
          fullName: 'Shalini Devi',
          mobileNumber: '9600123456',
          whatsAppNumber: '9600123456',
          email: 'shalini.devi@gmail.com',
          gender: 'Female',
          dateOfBirth: new Date('2003-03-08'),
          collegeName: 'Madurai Medical College',
          university: 'Tamil Nadu Dr. M.G.R. Medical University',
          department: 'MBBS',
          year: '4',
          district: 'Madurai',
          city: 'Shenoy Nagar',
          whyJoin: 'To organize free medical screening camps and health awareness campaigns in villages.',
          areasOfInterest: ['Social Service', 'Leadership'],
          createdAt: new Date('2026-06-10')
        },
        {
          fullName: 'Manoj Kumar',
          mobileNumber: '9789123456',
          whatsAppNumber: '9789123456',
          email: 'manoj.kumar@gmail.com',
          gender: 'Male',
          dateOfBirth: new Date('2005-10-15'),
          collegeName: 'Government Engineering College',
          university: 'Anna University',
          department: 'B.E. CSE',
          year: '2',
          district: 'Salem',
          city: 'Karuppur',
          whyJoin: 'I want to build software tools for students and expand the Mandram technical team.',
          areasOfInterest: ['Technical Team', 'Media Team'],
          createdAt: new Date('2026-06-11')
        },
        {
          fullName: 'Abirami Sundari',
          mobileNumber: '9445123456',
          whatsAppNumber: '9445123456',
          email: 'abirami.s@gmail.com',
          gender: 'Female',
          dateOfBirth: new Date('2004-06-14'),
          collegeName: 'Presidency College',
          university: 'Madras University',
          department: 'B.A. English Literature',
          year: '3',
          district: 'Chennai',
          city: 'Triplicane',
          whyJoin: 'To engage in creative writing, translation of old Tamil epics, and speech contests.',
          areasOfInterest: ['Tamil Literature', 'Public Speaking'],
          createdAt: new Date('2026-06-12')
        },
        {
          fullName: 'Hariharan V.',
          mobileNumber: '9843123456',
          whatsAppNumber: '9843123456',
          email: 'hariharan.v@gmail.com',
          gender: 'Male',
          dateOfBirth: new Date('2006-03-22'),
          collegeName: 'SRM Institute of Science and Tech',
          university: 'SRM University',
          department: 'B.Tech. ECE',
          year: '1',
          district: 'Chengalpattu',
          city: 'Kattankulathur',
          whyJoin: 'To participate actively in student council tasks and event management.',
          areasOfInterest: ['Event Management', 'Technical Team', 'Leadership'],
          createdAt: new Date('2026-06-13')
        },
        {
          fullName: 'Kavitha Selvaraj',
          mobileNumber: '9488123456',
          whatsAppNumber: '9488123456',
          email: 'kavitha.s@gmail.com',
          gender: 'Female',
          dateOfBirth: new Date('2005-09-09'),
          collegeName: 'VIT University',
          university: 'VIT',
          department: 'B.Tech. Biotechnology',
          year: '2',
          district: 'Vellore',
          city: 'Katpadi',
          whyJoin: 'I wish to work for empowerment of female students and organize cultural meets.',
          areasOfInterest: ['Leadership', 'Social Service', 'Public Speaking'],
          createdAt: new Date('2026-06-14')
        },
        {
          fullName: 'Balaji Saravanan',
          mobileNumber: '9944123456',
          whatsAppNumber: '9944123456',
          email: 'balaji.s@yahoo.com',
          gender: 'Male',
          dateOfBirth: new Date('2004-12-05'),
          collegeName: 'Jamal Mohamed College',
          university: 'Bharathidasan University',
          department: 'B.Sc. Chemistry',
          year: '3',
          district: 'Tiruchirappalli',
          city: 'Kaja Nagar',
          whyJoin: 'To lead blood donation camps and educational volunteer groups in primary schools.',
          areasOfInterest: ['Social Service', 'Leadership'],
          createdAt: new Date('2026-06-15')
        },
        {
          fullName: 'Archana Ravichandran',
          mobileNumber: '9500123456',
          whatsAppNumber: '9500123456',
          email: 'archana.r@gmail.com',
          gender: 'Female',
          dateOfBirth: new Date('2003-05-24'),
          collegeName: 'SASTRA University',
          university: 'SASTRA',
          department: 'B.Tech. CSE',
          year: '4',
          district: 'Thanjavur',
          city: 'Thirumalaisamudram',
          whyJoin: 'To coordinate community reach programs and mentor junior students in technology.',
          areasOfInterest: ['Technical Team', 'Leadership', 'Event Management'],
          createdAt: new Date('2026-06-16')
        },
        {
          fullName: 'Surya Prakash',
          mobileNumber: '9865123456',
          whatsAppNumber: '9865123456',
          email: 'surya.prakash@gmail.com',
          gender: 'Male',
          dateOfBirth: new Date('2005-07-19'),
          collegeName: 'Bishop Heber College',
          university: 'Bharathidasan University',
          department: 'B.C.A.',
          year: '2',
          district: 'Tiruchirappalli',
          city: 'Puthur',
          whyJoin: 'To handle media coverage, photography, and social media posting for all Mandram events.',
          areasOfInterest: ['Media Team', 'Event Management'],
          createdAt: new Date('2026-06-17')
        },
        {
          fullName: 'Deepika Mohan',
          mobileNumber: '9159123456',
          whatsAppNumber: '9159123456',
          email: 'deepika.m@gmail.com',
          gender: 'Female',
          dateOfBirth: new Date('2004-10-31'),
          collegeName: 'Annamalai University',
          university: 'Annamalai University',
          department: 'B.Sc. Agriculture',
          year: '3',
          district: 'Cuddalore',
          city: 'Chidambaram',
          whyJoin: 'I am passionate about environmental awareness and traditional organic farming models.',
          areasOfInterest: ['Social Service', 'Public Speaking'],
          createdAt: new Date('2026-06-18')
        },
        {
          fullName: 'Gopinath T.',
          mobileNumber: '9994123456',
          whatsAppNumber: '9994123456',
          email: 'gopinath.t@gmail.com',
          gender: 'Male',
          dateOfBirth: new Date('2003-01-15'),
          collegeName: 'Presidency College',
          university: 'Madras University',
          department: 'B.A. History',
          year: '3',
          district: 'Chennai',
          city: 'Royapettah',
          whyJoin: 'Deep interest in Tamil archeological excavations and historic cultural exhibitions.',
          areasOfInterest: ['Tamil Literature', 'Public Speaking', 'Leadership'],
          createdAt: new Date('2026-06-19')
        },
        {
          fullName: 'Sneha Vardhini',
          mobileNumber: '9443123456',
          whatsAppNumber: '9443123456',
          email: 'sneha.v@gmail.com',
          gender: 'Female',
          dateOfBirth: new Date('2005-03-27'),
          collegeName: 'Alagappa University',
          university: 'Alagappa University',
          department: 'B.Sc. Computer Science',
          year: '2',
          district: 'Sivaganga',
          city: 'Karaikudi',
          whyJoin: 'To connect Sivaganga district students with Tamil Maanavar Mandram schemes and events.',
          areasOfInterest: ['Event Management', 'Social Service', 'Technical Team'],
          createdAt: new Date('2026-06-20')
        }
      ];
      await Registration.insertMany(demoRegs);
      console.log('✔ Seeded 20 Demo Student Registrations');

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
      await Event.insertMany(demoEvents);
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
      await Gallery.insertMany(demoGallery);
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
      await Enquiry.insertMany(demoEnquiries);
      console.log('✔ Seeded 2 Demo Enquiries');
    }
  } catch (err) {
    console.error('Error seeding demo data:', err);
  }
};

// Connect to MongoDB
const startServer = async () => {
  try {
    console.log(`Attempting to connect to MongoDB at ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 4000 });
    console.log('Successfully connected to MongoDB Database.');
    await seedDemoData();
  } catch (err: any) {
    console.log('Local MongoDB connection failed. Starting MongoMemoryServer as fallback...');
    try {
      const mongod = await MongoMemoryServer.create({
        instance: {
          port: 27017
        }
      });
      const uri = mongod.getUri();
      console.log(`MongoMemoryServer started at: ${uri}`);
      await mongoose.connect(uri);
      console.log('Successfully connected to in-memory MongoDB Database.');
      await seedDemoData();
    } catch (innerErr) {
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
