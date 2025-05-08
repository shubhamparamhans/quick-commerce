import express from 'express';
import Warehouse from '../models/Warehouse';

const router = express.Router();

// Process a return for an order
router.post('/warehouses/:id/returns', async (req:any, res:any) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }

    const { orderId, items, reason } = req.body;
    warehouse.returns.push({ orderId, items, reason });
    await warehouse.save();

    res.status(201).json({ message: 'Return processed successfully' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Get return details for an order
router.get('/warehouses/:id/returns/:orderId', async (req:any, res:any) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }

    const returnDetails = warehouse.returns.find(
      (returnItem) => returnItem.orderId === req.params.orderId
    );

    if (!returnDetails) {
      return res.status(404).json({ error: 'Return details not found' });
    }

    res.status(200).json(returnDetails);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export default router;