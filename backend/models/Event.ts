import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  titleEn: string;
  titleTa: string;
  descriptionEn: string;
  descriptionTa: string;
  date: Date;
  image: string;
  type: 'upcoming' | 'past';
  createdAt: Date;
}

const EventSchema: Schema = new Schema({
  titleEn: { type: String, required: true, trim: true },
  titleTa: { type: String, required: true, trim: true },
  descriptionEn: { type: String, required: true, trim: true },
  descriptionTa: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  image: { type: String, default: '' },
  type: { type: String, enum: ['upcoming', 'past'], required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IEvent>('Event', EventSchema);
