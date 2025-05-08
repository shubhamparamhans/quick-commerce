import express from 'express';
import axios from 'axios';

const router = express.Router();

// Notify external services of inventory changes
router.post('/webhooks/inventory-change', async (req, res) => {
  try {
    const { url, payload } = req.body;

    // Send a POST request to the external service
    const response = await axios.post(url, payload);

    res.status(200).json({ message: 'Webhook sent successfully', response: response.data });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export default router;