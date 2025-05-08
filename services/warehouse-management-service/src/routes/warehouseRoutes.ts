import express from 'express';
import Warehouse from '../models/Warehouse';

const router = express.Router();

// Create a new warehouse
router.post('/warehouses', async (req, res) => {
  try {
    const warehouse = new Warehouse(req.body);
    await warehouse.save();
    res.status(201).json(warehouse);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

// Get all warehouses
router.get('/warehouses', async (req, res) => {
  try {
    const warehouses = await Warehouse.find();
    res.status(200).json(warehouses);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Get a single warehouse by ID
router.get('/warehouses/:id', async (req:any, res:any) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }
    res.status(200).json(warehouse);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Update a warehouse by ID
router.put('/warehouses/:id', async (req:any, res:any) => {
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }
    res.status(200).json(warehouse);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

// Delete a warehouse by ID
router.delete('/warehouses/:id', async (req:any, res:any) => {
  try {
    const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }
    res.status(200).json({ message: 'Warehouse deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export default router;