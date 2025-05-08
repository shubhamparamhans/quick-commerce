import express from 'express';
import Warehouse from '../models/Warehouse';
import { Request, Response } from 'express';
var AsyncRouter = require("express-async-router").AsyncRouter;
var router = AsyncRouter();
//req: Request, res: Response
// Add inventory to a warehouse
router.post('/warehouses/:id/inventory', async (req: Request, res: Response) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }
    warehouse.inventory.push(req.body);
    await warehouse.save();
    res.status(201).json(warehouse);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

// Get inventory of a warehouse
router.get('/warehouses/:id/inventory', async (req: Request, res: Response) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }
    res.status(200).json(warehouse.inventory);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Update inventory item in a warehouse
router.put('/warehouses/:id/inventory/:itemId', async (req: Request, res: Response) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }
    const item = warehouse.inventory[0];
    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    Object.assign(item, req.body);
    await warehouse.save();
    res.status(200).json(warehouse);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

// Delete inventory item from a warehouse
router.delete('/warehouses/:id/inventory/:itemId', async (req: Request, res: Response) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }
    // const item = warehouse.inventory.id(req.params.itemId);
    // if (!item) {
    //   return res.status(404).json({ error: 'Inventory item not found' });
    // }
    // item.remove();
    await warehouse.save();
    res.status(200).json(warehouse);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export default router;