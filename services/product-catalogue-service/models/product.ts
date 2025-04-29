import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  basePrice: number;
  availability: boolean;
  images: string[];
  avgRating: number;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    basePrice: { type: Number, required: true },
    availability: { type: Boolean, default: true },
    images: { type: [String], default: [] },
    avgRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', ProductSchema);