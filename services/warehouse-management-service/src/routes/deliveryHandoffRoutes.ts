
import Warehouse from '../models/Warehouse';
import { Request, Response } from 'express';
var AsyncRouter = require("express-async-router").AsyncRouter;
var router = AsyncRouter();


// const router = express.Router();



// Record delivery handoff with signature
router.post('/warehouses/:id/delivery-handoff', async (req: Request, res: Response) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }

    const { orderId, signature } = req.body;
    // warehouse.deliveryHandoffs.push({ orderId, signature });
    await warehouse.save();

    res.status(201).json({ message: 'Delivery handoff recorded successfully' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Get delivery handoff details for an order
router.get('/warehouses/:id/delivery-handoff/:orderId', async (req: Request, res: Response) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }

    // const handoff = warehouse.deliveryHandoffs.find(
    //   (handoff) => handoff.orderId === req.params.orderId
    // );

    // if (!handoff) {
    //   return res.status(404).json({ error: 'Delivery handoff not found' });
    // }

    res.status(200).json({}); //handoff
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export default router;