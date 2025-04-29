import { Request, Response } from 'express';
import Product from '../models/product';
import csv from 'csv-parser';
import fs from 'fs';
import multer from 'multer';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'product-images',
    format: async (req, file) => 'jpeg',
    public_id: (req, file) => file.originalname,
  },
});

const upload = multer({ storage });

// Controller to create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    // Placeholder logic for creating a product
    const product = req.body;
    res.status(201).json({ status: 'success', data: product });
  } catch (error) {
    res.status(500).json({ status: 'error', error: { code: 'INTERNAL_ERROR', message: 'An error occurred while creating the product' } });
  }
};

// Controller to get a product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    // Placeholder logic for fetching a product by ID
    const productId = req.params.id;
    res.status(200).json({ status: 'success', data: { id: productId } });
  } catch (error) {
    res.status(500).json({ status: 'error', error: { code: 'INTERNAL_ERROR', message: 'An error occurred while fetching the product' } });
  }
};

// Update a product by ID
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ status: 'error', error: { code: 'RESOURCE_NOT_FOUND', message: 'Product not found' } });
    }
    res.status(200).json({ status: 'success', data: product });
  } catch (error) {
    res.status(500).json({ status: 'error', error: { code: 'INTERNAL_ERROR', message: 'An error occurred while updating the product' } });
  }
};

// Delete a product by ID
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ status: 'error', error: { code: 'RESOURCE_NOT_FOUND', message: 'Product not found' } });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ status: 'error', error: { code: 'INTERNAL_ERROR', message: 'An error occurred while deleting the product' } });
  }
};

// List all products
export const listProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json({ status: 'success', data: products });
  } catch (error) {
    res.status(500).json({ status: 'error', error: { code: 'INTERNAL_ERROR', message: 'An error occurred while fetching products' } });
  }
};

// Search products with filtering
export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { category, price_min, price_max, attributes, q } = req.query;

    const filters: any = {};

    if (category) filters.category = category;
    if (price_min || price_max) {
      filters.basePrice = {};
      if (price_min) filters.basePrice.$gte = parseFloat(price_min as string);
      if (price_max) filters.basePrice.$lte = parseFloat(price_max as string);
    }
    if (attributes) filters.attributes = { $all: attributes };
    if (q) filters.$text = { $search: q as string };

    const products = await Product.find(filters);

    res.status(200).json({ status: 'success', data: products });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred while searching for products' },
    });
  }
};

// Advanced search using MongoDB aggregation
export const advancedSearchProducts = async (req: Request, res: Response) => {
  try {
    const { category, price_min, price_max, attributes, q } = req.query;

    const pipeline: any[] = [];

    if (q) {
      pipeline.push({ $match: { $text: { $search: q as string } } });
    }

    if (category) {
      pipeline.push({ $match: { category: category } });
    }

    if (price_min || price_max) {
      const priceFilter: any = {};
      if (price_min) priceFilter.$gte = parseFloat(price_min as string);
      if (price_max) priceFilter.$lte = parseFloat(price_max as string);
      pipeline.push({ $match: { basePrice: priceFilter } });
    }

    if (attributes) {
      pipeline.push({ $match: { attributes: { $all: attributes } } });
    }

    pipeline.push({
      $project: {
        name: 1,
        description: 1,
        basePrice: 1,
        avgRating: 1,
        images: 1,
      },
    });

    const products = await Product.aggregate(pipeline);

    res.status(200).json({ status: 'success', data: products });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred during advanced search' },
    });
  }
};

// Recommend products based on popularity or related items
export const recommendProducts = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    // Fetch the current product to find related items
    const currentProduct = await Product.findById(productId);
    if (!currentProduct) {
      return res.status(404).json({
        status: 'error',
        error: { code: 'RESOURCE_NOT_FOUND', message: 'Product not found' },
      });
    }

    // Example logic: Find products in the same category
    const relatedProducts = await Product.find({
      category: currentProduct.category,
      _id: { $ne: productId },
    }).limit(5);

    res.status(200).json({ status: 'success', data: relatedProducts });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred while fetching recommendations' },
    });
  }
};

// Bulk import products from a CSV file
export const bulkImportProducts = async (req: Request, res: Response) => {
  try {
    const filePath = req.file?.path;
    if (!filePath) {
      return res.status(400).json({
        status: 'error',
        error: { code: 'VALIDATION_ERROR', message: 'CSV file is required' },
      });
    }

    const products: any[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => products.push(row))
      .on('end', async () => {
        await Product.insertMany(products);
        res.status(201).json({ status: 'success', data: { count: products.length } });
      });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred during bulk import' },
    });
  }
};

// Bulk export products to a CSV file
export const bulkExportProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();

    const csvHeaders = ['name', 'description', 'basePrice', 'availability', 'images', 'avgRating'];
    const csvRows = products.map((product) =>
      csvHeaders.map((header) => product[header]).join(',')
    );

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');
    res.status(200).send([csvHeaders.join(','), ...csvRows].join('\n'));
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred during bulk export' },
    });
  }
};

// Add a review and rating for a product
export const addProductReview = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { rating, review } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        error: { code: 'RESOURCE_NOT_FOUND', message: 'Product not found' },
      });
    }

    product.reviews.push({ rating, review });
    product.avgRating =
      product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;

    await product.save();

    res.status(201).json({ status: 'success', data: product });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred while adding the review' },
    });
  }
};

// Get reviews for a product
export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        error: { code: 'RESOURCE_NOT_FOUND', message: 'Product not found' },
      });
    }

    res.status(200).json({ status: 'success', data: product.reviews });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred while fetching reviews' },
    });
  }
};

// Upload and resize product image
export const uploadProductImage = [
  upload.single('image'),
  async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({
          status: 'error',
          error: { code: 'VALIDATION_ERROR', message: 'Image file is required' },
        });
      }

      // Resize image using Sharp
      const resizedImageBuffer = await sharp(file.buffer)
        .resize(500, 500)
        .jpeg({ quality: 80 })
        .toBuffer();

      // Upload resized image to Cloudinary
      const result = await cloudinary.uploader.upload_stream({
        folder: 'product-images',
      }, (error, result) => {
        if (error) {
          throw error;
        }
        return result;
      });

      res.status(201).json({ status: 'success', data: { url: result.secure_url } });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        error: { code: 'INTERNAL_ERROR', message: 'An error occurred while uploading the image' },
      });
    }
  },
];