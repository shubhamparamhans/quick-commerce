import express from 'express';
import Warehouse from '../models/Warehouse';

const router = express.Router();

// Optimize order picking using shortest path algorithm
router.post('/warehouses/:id/order-picking', async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }

    const { items } = req.body; // Array of items to pick

    // Example shortest path algorithm (simplified for demonstration)
    const optimizedPath = items.sort((a, b) => a.location.localeCompare(b.location));

    res.status(200).json({ optimizedPath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;