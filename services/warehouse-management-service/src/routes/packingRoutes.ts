import express from 'express';
import Warehouse from '../models/Warehouse';

const router = express.Router();

// Add packing instructions for an order
router.post('/warehouses/:id/packing', async (req:any, res:any) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }

    const { orderId, instructions } = req.body;
    // warehouse.packingInstructions.push({ orderId, instructions });
    await warehouse.save();

    res.status(201).json({ message: 'Packing instructions added successfully' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Get packing instructions for an order
router.get('/warehouses/:id/packing/:orderId', async (req:any, res:any) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }

    const instructions = {}
    // warehouse.packingInstructions.find(
    //   (instruction: { orderId: any; }) => instruction.orderId === req.params.orderId
    // );

    if (!instructions) {
      return res.status(404).json({ error: 'Packing instructions not found' });
    }

    res.status(200).json(instructions);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export default router;