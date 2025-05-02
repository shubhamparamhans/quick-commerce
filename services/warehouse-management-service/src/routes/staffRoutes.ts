import express from 'express';
import Warehouse from '../models/Warehouse';

const router = express.Router();

// Assign a task to a staff member
router.post('/warehouses/:id/staff', async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }
    warehouse.staffAssignments.push(req.body);
    await warehouse.save();
    res.status(201).json(warehouse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all staff assignments for a warehouse
router.get('/warehouses/:id/staff', async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }
    res.status(200).json(warehouse.staffAssignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a staff assignment
router.put('/warehouses/:id/staff/:staffId', async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }
    const assignment = warehouse.staffAssignments.id(req.params.staffId);
    if (!assignment) {
      return res.status(404).json({ error: 'Staff assignment not found' });
    }
    Object.assign(assignment, req.body);
    await warehouse.save();
    res.status(200).json(warehouse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a staff assignment
router.delete('/warehouses/:id/staff/:staffId', async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }
    const assignment = warehouse.staffAssignments.id(req.params.staffId);
    if (!assignment) {
      return res.status(404).json({ error: 'Staff assignment not found' });
    }
    assignment.remove();
    await warehouse.save();
    res.status(200).json(warehouse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;