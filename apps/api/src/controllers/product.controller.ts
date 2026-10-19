import { Request, Response } from 'express';
import { Product } from '../models/Product';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { gender, shape, brand, search, minPrice, maxPrice } = req.query;

    const query: any = { isActive: true };

    if (gender && gender !== 'all') {
      query.gender = gender;
    }
    if (shape && shape !== 'all') {
      query.shape = shape;
    }
    if (brand && brand !== 'all') {
      query.brand = { $regex: brand, $options: 'i' };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { modelCode: { $regex: search, $options: 'i' } },
      ];
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error fetching products.' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.status(200).json(product);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error fetching product.' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, brand, modelCode, gender, shape, material, price, stockCount, images } = req.body;

    const newProduct = await Product.create({
      title,
      brand,
      modelCode,
      gender,
      shape,
      material,
      price: Number(price),
      stockCount: Number(stockCount),
      images: images || [],
      isActive: true,
    });

    return res.status(201).json(newProduct);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error creating product.' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.status(200).json(updatedProduct);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error updating product.' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error deleting product.' });
  }
};
