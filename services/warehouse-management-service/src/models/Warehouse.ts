import mongoose, { Schema, Document } from 'mongoose';

interface IInventory {
  product: string;
  quantity: number;
  location: string;
}

interface IZone {
  name: string;
  shelves: string[];
}

interface IStaffAssignment {
  staffId: string;
  task: string;
  performanceMetrics: string;
}

interface IWarehouse extends Document {
  name: string;
  location: string;
  inventory: IInventory[];
  zones: IZone[];
  staffAssignments: IStaffAssignment[];
  qualityControlCheckpoints: string[];
}

const InventorySchema: Schema = new Schema({
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  location: { type: String, required: true },
});

const ZoneSchema: Schema = new Schema({
  name: { type: String, required: true },
  shelves: { type: [String], required: true },
});

const StaffAssignmentSchema: Schema = new Schema({
  staffId: { type: String, required: true },
  task: { type: String, required: true },
  performanceMetrics: { type: String, required: true },
});

const WarehouseSchema: Schema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  inventory: { type: [InventorySchema], required: true },
  zones: { type: [ZoneSchema], required: true },
  staffAssignments: { type: [StaffAssignmentSchema], required: true },
  qualityControlCheckpoints: { type: [String], required: true },
});

export default mongoose.model<IWarehouse>('Warehouse', WarehouseSchema);