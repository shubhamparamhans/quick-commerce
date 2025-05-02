import express from 'express';
import Warehouse from '../models/Warehouse';

const router = express.Router();

// Add a quality control checkpoint
router.post('/warehouses/:id/quality-control', async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }
    warehouse.qualityControlCheckpoints.push(req.body.checkpoint);
    await warehouse.save();
    res.status(201).json(warehouse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all quality control checkpoints for a warehouse
router.get('/warehouses/:id/quality-control', async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }
    res.status(200).json(warehouse.qualityControlCheckpoints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a quality control checkpoint
router.delete('/warehouses/:id/quality-control/:checkpoint', async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }
    warehouse.qualityControlCheckpoints = warehouse.qualityControlCheckpoints.filter(
      (checkpoint) => checkpoint !== req.params.checkpoint
    );
    await warehouse.save();
    res.status(200).json(warehouse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;