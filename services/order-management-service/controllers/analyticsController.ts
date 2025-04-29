import { Request, Response } from 'express';
import Order from '../models/order';
import { Op } from 'sequelize';

// Controller to fetch order analytics
export const getOrderAnalytics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter: any = {};
    if (startDate) dateFilter[Op.gte] = new Date(startDate as string);
    if (endDate) dateFilter[Op.lte] = new Date(endDate as string);

    // Fetch analytics data
    const totalOrders = await Order.count({ where: { createdAt: dateFilter } });
    const totalRevenue = await Order.sum('pricing.total', { where: { createdAt: dateFilter } });
    const averageOrderValue = totalRevenue / totalOrders || 0;

    res.status(200).json({
      status: 'success',
      data: {
        totalOrders,
        totalRevenue,
        averageOrderValue,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred while fetching analytics data' },
    });
  }
};