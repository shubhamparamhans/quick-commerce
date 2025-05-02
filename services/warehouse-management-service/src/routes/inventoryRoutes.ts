import express from 'express';
import Warehouse from '../models/Warehouse';

const router = express.Router();

// Add inventory to a warehouse
router.post('/warehouses/:id/inventory', async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }
    warehouse.inventory.push(req.body);
    await warehouse.save();
    res.status(201).json(warehouse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get inventory of a warehouse
router.get('/warehouses/:id/inventory', async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }
    res.status(200).json(warehouse.inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update inventory item in a warehouse
router.put('/warehouses/:id/inventory/:itemId', async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }
    const item = warehouse.inventory.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    Object.assign(item, req.body);
    await warehouse.save();
    res.status(200).json(warehouse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete inventory item from a warehouse
router.delete('/warehouses/:id/inventory/:itemId', async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }
    const item = warehouse.inventory.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    item.remove();
    await warehouse.save();
    res.status(200).json(warehouse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;