import express from 'express';
import Warehouse from '../models/Warehouse';

const router = express.Router();

// Get warehouse efficiency metrics
router.get('/warehouses/:id/efficiency-metrics', async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }

    // Example metrics calculation (simplified for demonstration)
    const totalInventoryItems = warehouse.inventory.length;
    const totalStaffAssignments = warehouse.staffAssignments.length;
    const efficiencyScore = (totalInventoryItems + totalStaffAssignments) / 2; // Example formula

    res.status(200).json({
      totalInventoryItems,
      totalStaffAssignments,
      efficiencyScore,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;