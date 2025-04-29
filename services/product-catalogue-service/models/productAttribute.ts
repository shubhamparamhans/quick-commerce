import mongoose, { Schema, Document } from 'mongoose';

export interface IProductAttribute extends Document {
  key: string;
  value: string;
}

const ProductAttributeSchema: Schema = new Schema(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProductAttribute>('ProductAttribute', ProductAttributeSchema);