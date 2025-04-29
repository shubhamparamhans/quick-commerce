import { Request, Response } from 'express';
import Order from '../models/order';
import OrderStatusHistory from '../models/orderStatusHistory';
import Inventory from '../models/inventory';
import Warehouse from '../models/warehouse';
import { publishMessage } from '../utils/rabbitmq';
import { emitOrderStatusUpdate } from '../utils/realtime';

// Enhanced createOrder controller to publish inventory update event
export const createOrder = async (req: Request, res: Response) => {
  try {
    const order = req.body;

    // Placeholder logic for creating an order
    const createdOrder = { id: 'order-id-placeholder', ...order };

    // Publish inventory update event
    await publishMessage('inventory_updates', {
      event: 'ORDER_PLACED',
      orderId: createdOrder.id,
      items: createdOrder.items,
    });

    res.status(201).json({ status: 'success', data: createdOrder });
  } catch (error) {
    res.status(500).json({ status: 'error', error: { code: 'INTERNAL_ERROR', message: 'An error occurred while creating the order' } });
  }
};

// Controller to get an order by ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    // Placeholder logic for fetching an order by ID
    const orderId = req.params.id;
    res.status(200).json({ status: 'success', data: { id: orderId } });
  } catch (error) {
    res.status(500).json({ status: 'error', error: { code: 'INTERNAL_ERROR', message: 'An error occurred while fetching the order' } });
  }
};

// Enhanced updateOrderStatus controller to emit real-time updates
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId, status, note } = req.body;

    // Find the order
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({
        status: 'error',
        error: { code: 'RESOURCE_NOT_FOUND', message: 'Order not found' },
      });
    }

    // Update order status
    order.status = status;
    await order.save();

    // Add status to history
    await OrderStatusHistory.create({
      orderId: order.id,
      status,
      note,
      timestamp: new Date(),
    });

    // Emit real-time order status update
    emitOrderStatusUpdate(order.id, status);

    res.status(200).json({
      status: 'success',
      data: { orderId: order.id, status },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred while updating order status' },
    });
  }
};

// Enhanced cancelOrder controller to publish inventory update event
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { orderId, reason } = req.body;

    // Find the order
    const order = await Order.findByPk(orderId, { include: ['items'] });
    if (!order) {
      return res.status(404).json({
        status: 'error',
        error: { code: 'RESOURCE_NOT_FOUND', message: 'Order not found' },
      });
    }

    if (order.status === 'cancelled') {
      return res.status(422).json({
        status: 'error',
        error: { code: 'ORDER_ALREADY_CANCELLED', message: 'Order is already cancelled' },
      });
    }

    // Update order status to cancelled
    order.status = 'cancelled';
    await order.save();

    // Adjust inventory for each item in the order
    for (const item of order.items) {
      const inventory = await Inventory.findOne({ where: { productId: item.productId } });
      if (inventory) {
        inventory.quantity += item.quantity;
        await inventory.save();
      }
    }

    // Add cancellation to status history
    await OrderStatusHistory.create({
      orderId: order.id,
      status: 'cancelled',
      note: reason,
      timestamp: new Date(),
    });

    // Publish inventory update event
    await publishMessage('inventory_updates', {
      event: 'ORDER_CANCELLED',
      orderId: order.id,
      items: order.items,
    });

    res.status(200).json({
      status: 'success',
      data: { orderId: order.id, status: 'cancelled' },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred while cancelling the order' },
    });
  }
};

// Controller to search and filter orders
export const searchOrders = async (req: Request, res: Response) => {
  try {
    const { status, customerId, startDate, endDate } = req.query;

    // Build query filters
    const filters: any = {};
    if (status) filters.status = status;
    if (customerId) filters.customerId = customerId;
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt[Op.gte] = new Date(startDate as string);
      if (endDate) filters.createdAt[Op.lte] = new Date(endDate as string);
    }

    // Fetch orders with filters
    const orders = await Order.findAll({ where: filters });

    res.status(200).json({
      status: 'success',
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred while searching orders' },
    });
  }
};

// Controller to estimate delivery time
export const estimateDeliveryTime = async (req: Request, res: Response) => {
  try {
    const { warehouseId, customerAddress } = req.body;

    // Find the warehouse
    const warehouse = await Warehouse.findByPk(warehouseId);
    if (!warehouse) {
      return res.status(404).json({
        status: 'error',
        error: { code: 'RESOURCE_NOT_FOUND', message: 'Warehouse not found' },
      });
    }

    // Placeholder logic for delivery time estimation
    const estimatedTime = Math.random() * (120 - 30) + 30; // Random time between 30 and 120 minutes

    res.status(200).json({
      status: 'success',
      data: { estimatedDeliveryTime: `${Math.round(estimatedTime)} minutes` },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred while estimating delivery time' },
    });
  }
};

// Controller to process returns and refunds
export const processReturnAndRefund = async (req: Request, res: Response) => {
  try {
    const { orderId, items, reason } = req.body;

    // Find the order
    const order = await Order.findByPk(orderId, { include: ['items'] });
    if (!order) {
      return res.status(404).json({
        status: 'error',
        error: { code: 'RESOURCE_NOT_FOUND', message: 'Order not found' },
      });
    }

    if (order.status !== 'delivered') {
      return res.status(422).json({
        status: 'error',
        error: { code: 'INVALID_ORDER_STATUS', message: 'Only delivered orders can be returned' },
      });
    }

    // Process return for each item
    for (const item of items) {
      const orderItem = order.items.find((i) => i.id === item.id);
      if (orderItem) {
        // Adjust inventory
        const inventory = await Inventory.findOne({ where: { productId: orderItem.productId } });
        if (inventory) {
          inventory.quantity += item.quantity;
          await inventory.save();
        }
      }
    }

    // Update order status to refunded
    order.status = 'refunded';
    await order.save();

    // Add refund to status history
    await OrderStatusHistory.create({
      orderId: order.id,
      status: 'refunded',
      note: reason,
      timestamp: new Date(),
    });

    res.status(200).json({
      status: 'success',
      data: { orderId: order.id, status: 'refunded' },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred while processing the return and refund' },
    });
  }
};