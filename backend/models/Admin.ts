import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  username: string;
  passwordHash: string;
  createdAt: Date;
}

const AdminSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IAdmin>('Admin', AdminSchema);
