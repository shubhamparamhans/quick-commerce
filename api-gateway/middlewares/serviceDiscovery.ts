import { Request, Response, NextFunction } from 'express';
import Consul from 'consul';

const consul = new Consul();

export const serviceDiscoveryMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const serviceName = req.path.split('/')[1]; // Extract service name from path
    const services = await consul.catalog.service.nodes(serviceName);

    if (services.length > 0) {
      req.headers['service-url'] = services[0].ServiceAddress;
    } else {
      return res.status(503).json({ message: 'Service Unavailable' });
    }

    next();
  } catch (error) {
    next(error);
  }
};