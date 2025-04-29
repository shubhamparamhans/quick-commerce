import { Request, Response } from 'express';
import ProductAttribute from '../models/productAttribute';

// Controller to create a new product attribute
export const createProductAttribute = async (req: Request, res: Response) => {
  try {
    const productAttribute = new ProductAttribute(req.body);
    await productAttribute.save();
    res.status(201).json({ status: 'success', data: productAttribute });
  } catch (error) {
    res.status(500).json({ status: 'error', error: { code: 'INTERNAL_ERROR', message: 'An error occurred while creating the product attribute' } });
  }
};

// Controller to get a product attribute by ID
export const getProductAttributeById = async (req: Request, res: Response) => {
  try {
    const productAttribute = await ProductAttribute.findById(req.params.id);
    if (!productAttribute) {
      return res.status(404).json({ status: 'error', error: { code: 'RESOURCE_NOT_FOUND', message: 'Product attribute not found' } });
    }
    res.status(200).json({ status: 'success', data: productAttribute });
  } catch (error) {
    res.status(500).json({ status: 'error', error: { code: 'INTERNAL_ERROR', message: 'An error occurred while fetching the product attribute' } });
  }
};

// Update a product attribute by ID
export const updateProductAttribute = async (req: Request, res: Response) => {
  try {
    const productAttribute = await ProductAttribute.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!productAttribute) {
      return res.status(404).json({ status: 'error', error: { code: 'RESOURCE_NOT_FOUND', message: 'Product attribute not found' } });
    }
    res.status(200).json({ status: 'success', data: productAttribute });
  } catch (error) {
    res.status(500).json({ status: 'error', error: { code: 'INTERNAL_ERROR', message: 'An error occurred while updating the product attribute' } });
  }
};

// Delete a product attribute by ID
export const deleteProductAttribute = async (req: Request, res: Response) => {
  try {
    const productAttribute = await ProductAttribute.findByIdAndDelete(req.params.id);
    if (!productAttribute) {
      return res.status(404).json({ status: 'error', error: { code: 'RESOURCE_NOT_FOUND', message: 'Product attribute not found' } });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ status: 'error', error: { code: 'INTERNAL_ERROR', message: 'An error occurred while deleting the product attribute' } });
  }
};

// List all product attributes
export const listProductAttributes = async (req: Request, res: Response) => {
  try {
    const productAttributes = await ProductAttribute.find();
    res.status(200).json({ status: 'success', data: productAttributes });
  } catch (error) {
    res.status(500).json({ status: 'error', error: { code: 'INTERNAL_ERROR', message: 'An error occurred while fetching product attributes' } });
  }
};