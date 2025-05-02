import express from 'express';
import Warehouse from '../models/Warehouse';

const router = express.Router();

// Batch update inventory for a warehouse
router.post('/warehouses/:id/batch-inventory', async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }

    const { updates } = req.body; // Array of inventory updates

    updates.forEach((update: any) => {
      const item = warehouse.inventory.find((i) => i.product === update.product);
      if (item) {
        item.quantity = update.quantity;
      } else {
        warehouse.inventory.push(update);
      }
    });

    await warehouse.save();
    res.status(200).json({ message: 'Batch inventory update successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;