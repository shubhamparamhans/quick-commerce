import express from 'express';
import Warehouse from '../models/Warehouse';

const router = express.Router();

// Get inventory forecasting and reordering suggestions
router.get('/warehouses/:id/inventory-forecasting', async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }

    // Example logic for inventory forecasting (simplified for demonstration)
    const suggestions = warehouse.inventory.map((item) => {
      const reorderThreshold = 10; // Example threshold
      return {
        product: item.product,
        currentStock: item.quantity,
        reorder: item.quantity < reorderThreshold,
        suggestedOrderQuantity: item.quantity < reorderThreshold ? 20 : 0,
      };
    });

    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;