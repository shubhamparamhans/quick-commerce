import { Request, Response, NextFunction } from 'express';
import Ajv from 'ajv';

const ajv = new Ajv();

export const validateRequest = (schema: object) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validate = ajv.compile(schema);
    const valid = validate(req.body);
    if (!valid) {
      return res.status(400).json({ errors: validate.errors });
    }
    next();
  };
};