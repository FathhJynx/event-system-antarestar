import type { Request, Response } from 'express';
import * as categoryService from '../services/categoryService.js';

export const getCategories = async (req: Request, res: Response) => {
    try {
        const includeCount = req.query.includeCount === 'true';
        const categories = await categoryService.getCategories(includeCount);
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error });
    }
};

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id as string);
        res.json(category);
    } catch (error: any) {
        if (error.message === 'Category not found') {
            res.status(404).json({ message: 'Category not found' });
        } else {
            res.status(500).json({ message: 'Error fetching category', error });
        }
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const category = await categoryService.createCategory(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error creating category', error });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const updatedCategory = await categoryService.updateCategory(req.params.id as string, req.body);
        res.json(updatedCategory);
    } catch (error: any) {
        if (error.message === 'Category not found') {
            res.status(404).json({ message: 'Category not found' });
        } else {
            res.status(500).json({ message: 'Error updating category', error });
        }
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        await categoryService.deleteCategory(req.params.id as string);
        res.status(204).send();
    } catch (error: any) {
        if (error.message === 'Category not found') {
            res.status(404).json({ message: 'Category not found' });
        } else {
            res.status(500).json({ message: 'Error deleting category', error });
        }
    }
};
