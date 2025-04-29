import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description: string;
  parentId?: string;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>('Category', CategorySchema);