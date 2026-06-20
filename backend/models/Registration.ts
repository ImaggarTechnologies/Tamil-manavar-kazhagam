import mongoose, { Schema, Document } from 'mongoose';

export interface IRegistration extends Document {
  fullName: string;
  mobileNumber: string;
  whatsAppNumber: string;
  email: string;
  gender: string;
  dateOfBirth: Date;
  collegeName: string;
  university: string;
  department: string;
  year: string;
  district: string;
  city: string;
  whyJoin: string;
  areasOfInterest: string[];
  createdAt: Date;
}

const RegistrationSchema: Schema = new Schema({
  fullName: { type: String, required: true, trim: true },
  mobileNumber: { type: String, required: true, trim: true },
  whatsAppNumber: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  gender: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  collegeName: { type: String, required: true, trim: true },
  university: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  year: { type: String, required: true },
  district: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  whyJoin: { type: String, trim: true },
  areasOfInterest: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IRegistration>('Registration', RegistrationSchema);
