import { Request, Response } from 'express';
import ProductVariant from '../models/productVariant';

// Controller to create a new product variant
export const createProductVariant = async (req: Request, res: Response) => {
  try {
    const productVariant = new ProductVariant(req.body);
    await productVariant.save();
    res.status(201).json({ status: 'success', data: productVariant });
  } catch (error) {
    res.status(500).json({ status: 'error', error: { code: 'INTERNAL_ERROR', message: 'An error occurred while creating the product variant' } });
  }
};

// Controller to get a product variant by ID
export const getProductVariantById = async (req: Request, res: Response) => {
  try {
    const productVariant = await ProductVariant.findById(req.params.id);
    if (!productVariant) {
      return res.status(404).json({ status: 'error', error: { code: 'RESOURCE_NOT_FOUND', message: 'Product variant not found' } });
    }
    res.status(200).json({ status: 'success', data: productVariant });
  } catch (error) {
    res.status(500).json({ status: 'error', error: { code: 'INTERNAL_ERROR', message: 'An error occurred while fetching the product variant' } });
  }
};

// Update a product variant by ID
export const updateProductVariant = async (req: Request, res: Response) => {
  try {
    const productVariant = await ProductVariant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!productVariant) {
      return res.status(404).json({ status: 'error', error: { code: 'RESOURCE_NOT_FOUND', message: 'Product variant not found' } });
    }
    res.status(200).json({ status: 'success', data: productVariant });
  } catch (error) {
    res.status(500).json({ status: 'error', error: { code: 'INTERNAL_ERROR', message: 'An error occurred while updating the product variant' } });
  }
};

// Delete a product variant by ID
export const deleteProductVariant = async (req: Request, res: Response) => {
  try {
    const productVariant = await ProductVariant.findByIdAndDelete(req.params.id);
    if (!productVariant) {
      return res.status(404).json({ status: 'error', error: { code: 'RESOURCE_NOT_FOUND', message: 'Product variant not found' } });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ status: 'error', error: { code: 'INTERNAL_ERROR', message: 'An error occurred while deleting the product variant' } });
  }
};

// List all product variants
export const listProductVariants = async (req: Request, res: Response) => {
  try {
    const productVariants = await ProductVariant.find();
    res.status(200).json({ status: 'success', data: productVariants });
  } catch (error) {
    res.status(500).json({ status: 'error', error: { code: 'INTERNAL_ERROR', message: 'An error occurred while fetching product variants' } });
  }
};

// Check inventory for a product variant
export const checkInventory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productVariant = await ProductVariant.findById(id);

    if (!productVariant) {
      return res.status(404).json({
        status: 'error',
        error: { code: 'RESOURCE_NOT_FOUND', message: 'Product variant not found' },
      });
    }

    res.status(200).json({
      status: 'success',
      data: { inventoryCount: productVariant.inventoryCount },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred while checking inventory' },
    });
  }
};

// Update inventory for a product variant
export const updateInventory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { inventoryCount } = req.body;

    const productVariant = await ProductVariant.findByIdAndUpdate(
      id,
      { inventoryCount },
      { new: true }
    );

    if (!productVariant) {
      return res.status(404).json({
        status: 'error',
        error: { code: 'RESOURCE_NOT_FOUND', message: 'Product variant not found' },
      });
    }

    res.status(200).json({ status: 'success', data: productVariant });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred while updating inventory' },
    });
  }
};