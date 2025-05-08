import express from 'express';
import Warehouse from '../models/Warehouse';
import { Request, Response } from 'express';
var AsyncRouter = require("express-async-router").AsyncRouter;
var router = AsyncRouter();
//req: Request, res: Response
// const router = express.Router();

// Optimize order picking using shortest path algorithm
router.post('/warehouses/:id/order-picking', async (req: Request, res: Response) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }

    const { items } = req.body; // Array of items to pick

    // Example shortest path algorithm (simplified for demonstration)
    const optimizedPath = items.sort((a: { location: string; }, b: { location: any; }) => a.location.localeCompare(b.location));

    res.status(200).json({ optimizedPath });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export default router;