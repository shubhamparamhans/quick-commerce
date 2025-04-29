import { Request, Response } from 'express';
import Category from '../models/category';

// Controller to create a new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json({ status: 'success', data: category });
  } catch (error) {
    res.status(500).json({ status: 'error', error: { code: 'INTERNAL_ERROR', message: 'An error occurred while creating the category' } });
  }
};

// Controller to get a category by ID
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ status: 'error', error: { code: 'RESOURCE_NOT_FOUND', message: 'Category not found' } });
    }
    res.status(200).json({ status: 'success', data: category });
  } catch (error) {
    res.status(500).json({ status: 'error', error: { code: 'INTERNAL_ERROR', message: 'An error occurred while fetching the category' } });
  }
};

// Update a category by ID
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) {
      return res.status(404).json({ status: 'error', error: { code: 'RESOURCE_NOT_FOUND', message: 'Category not found' } });
    }
    res.status(200).json({ status: 'success', data: category });
  } catch (error) {
    res.status(500).json({ status: 'error', error: { code: 'INTERNAL_ERROR', message: 'An error occurred while updating the category' } });
  }
};

// Delete a category by ID
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ status: 'error', error: { code: 'RESOURCE_NOT_FOUND', message: 'Category not found' } });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ status: 'error', error: { code: 'INTERNAL_ERROR', message: 'An error occurred while deleting the category' } });
  }
};

// List all categories
export const listCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ status: 'success', data: categories });
  } catch (error) {
    res.status(500).json({ status: 'error', error: { code: 'INTERNAL_ERROR', message: 'An error occurred while fetching categories' } });
  }
};