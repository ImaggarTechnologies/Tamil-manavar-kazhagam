import mongoose, { Schema, Document } from 'mongoose';

export interface IGallery extends Document {
  titleEn: string;
  titleTa: string;
  mediaUrl: string;
  mediaType: 'photo' | 'video';
  albumNameEn: string;
  albumNameTa: string;
  createdAt: Date;
}

const GallerySchema: Schema = new Schema({
  titleEn: { type: String, required: true, trim: true },
  titleTa: { type: String, required: true, trim: true },
  mediaUrl: { type: String, required: true },
  mediaType: { type: String, enum: ['photo', 'video'], default: 'photo' },
  albumNameEn: { type: String, required: true, trim: true },
  albumNameTa: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IGallery>('Gallery', GallerySchema);
