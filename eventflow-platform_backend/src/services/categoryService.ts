import { categoryRepository } from '../repositories/categoryRepository.js';

export const getCategories = async (includeCount: boolean) => {
    return categoryRepository.findAll(includeCount);
};

export const getCategoryById = async (id: string) => {
    const category = await categoryRepository.findById(id);
    if (!category) {
        throw new Error('Category not found');
    }
    return category;
};

export const createCategory = async (data: any) => {
    return categoryRepository.create(data);
};

export const updateCategory = async (id: string, data: any) => {
    const updatedCategory = await categoryRepository.update(id, data);
    if (!updatedCategory) {
        throw new Error('Category not found');
    }
    return updatedCategory;
};

export const deleteCategory = async (id: string) => {
    const deleted = await categoryRepository.delete(id);
    if (!deleted) {
        throw new Error('Category not found');
    }
    return true;
};
