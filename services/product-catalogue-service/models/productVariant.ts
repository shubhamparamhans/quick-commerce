import mongoose, { Schema, Document } from 'mongoose';

export interface IProductVariant extends Document {
  productId: string;
  size: string;
  color: string;
  weight: number;
  priceAdjustment: number;
  sku: string;
  inventoryCount: number;
}

const ProductVariantSchema: Schema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    weight: { type: Number, required: true },
    priceAdjustment: { type: Number, required: true },
    sku: { type: String, required: true, unique: true },
    inventoryCount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProductVariant>('ProductVariant', ProductVariantSchema);