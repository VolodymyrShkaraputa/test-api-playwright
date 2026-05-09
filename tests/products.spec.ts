import { test } from '../fixtures/api';
import { expect } from '@playwright/test';

test.describe('Test suite for checking API requests for products', () => {
  test('Get products by limit', async ({ api }) => {
    const responseJSON = await api
      .url()
      .path('/products')
      .params({ limit: '10' })
      .getRequest(200);

    expect(typeof responseJSON).toBe('object');
    expect(Array.isArray(responseJSON.products)).toBe(true);
  });

  test('Get a single product', async ({ api }) => {
    const getResponseProductJSON = await api
      .url()
      .path('/products/1')
      .getRequest(200);

    expect(typeof getResponseProductJSON).toBe('object');
    expect(getResponseProductJSON).toHaveProperty('id');
    expect(getResponseProductJSON).toHaveProperty('price');
    expect(getResponseProductJSON).toHaveProperty('category');
  });

  test('Search product', async ({ api }) => {
    const responseSearchJSON = await api
      .url()
      .path('/products/search')
      .params({ q: 'phone', limit: '10' })
      .getRequest(200);

    expect(typeof responseSearchJSON).toBe('object');
    expect(Array.isArray(responseSearchJSON.products)).toBe(true);
    responseSearchJSON.products.forEach((searchProduct: string) => {
      expect(searchProduct).toHaveProperty('id');
      expect(searchProduct).toHaveProperty('price');
      expect(searchProduct).toHaveProperty('category');
    });
  });

  test('Limit and skip products', async ({ api }) => {
    const responseLimitProductsJSON = await api
      .url()
      .path('/products')
      .params({ limit: '10', skip: '10', select: 'title' })
      .getRequest(200);

    expect(typeof responseLimitProductsJSON).toBe('object');
    expect(Array.isArray(responseLimitProductsJSON.products)).toBe(true);
    responseLimitProductsJSON.products.forEach((searchProduct: string) => {
      expect(searchProduct).toHaveProperty('id');
      expect(searchProduct).toHaveProperty('title');
    });
  });

  test('Sort products', async ({ api }) => {
    const sortResponseJSON = await api
      .url()
      .path('/products')
      .params({ sortBy: 'title', order: 'asc', limit: '10' })
      .getRequest(200);

    expect(typeof sortResponseJSON).toBe('object');
    expect(Array.isArray(sortResponseJSON.products)).toBe(true);
    sortResponseJSON.products.forEach((sortBy: string) => {
      expect(sortBy).toHaveProperty('id');
      expect(sortBy).toHaveProperty('category');
      expect(sortBy).toHaveProperty('price');
    });
  });

  test('Get all products categories', async ({ api }) => {
    const getAllCategoriesResponseJSON = await api
      .url()
      .path('/products/categories')
      .params({ sortBy: 'title', order: 'asc', limit: '10' })
      .getRequest(200);

    expect(Array.isArray(getAllCategoriesResponseJSON)).toBe(true);
    getAllCategoriesResponseJSON.forEach((categories: string) => {
      expect(categories).toHaveProperty('slug');
      expect(categories).toHaveProperty('name');
      expect(categories).toHaveProperty('url');
    });
  });

  test('Get products category list', async ({ api }) => {
    const getProductsCategoryListResJSON = await api
      .url()
      .path('/products/category-list')
      .getRequest(200);

    expect(typeof getProductsCategoryListResJSON).toBe('object');
    expect(Array.isArray(getProductsCategoryListResJSON)).toBe(true);
  });

  test('Get products by a category', async ({ api }) => {
    const getProductByCategoryResJSON = await api
      .url()
      .path('/products/category/smartphones')
      .params({ limit: '10' })
      .getRequest(200);

    expect(typeof getProductByCategoryResJSON).toBe('object');
    expect(Array.isArray(getProductByCategoryResJSON.products)).toBe(true);
    getProductByCategoryResJSON.products.forEach((productsCategory: string) => {
      expect(productsCategory).toHaveProperty('id');
      expect(productsCategory).toHaveProperty('title');
      expect(productsCategory).toHaveProperty('category');
    });
  });

  test('Add a new product', async ({ api }) => {
    const newProductResponseJSON = await api
      .url()
      .path('/products/add')
      .body({
        title: 'test-product',
      })
      .postRequest(201);

    expect(typeof newProductResponseJSON).toBe('object');
    expect(newProductResponseJSON).toHaveProperty('id');
    expect(newProductResponseJSON).toHaveProperty('title');
    const updatedProductResponseJSON = await api
      .url()
      .path('/products/1')
      .headers({ 'Content-Type': 'application/json' })
      .body({
        title: 'iPhone Galaxy-UPDATED',
      })
      .putRequest(200);

    expect(typeof updatedProductResponseJSON).toBe('object');
    expect(updatedProductResponseJSON).toHaveProperty('id');
    expect(updatedProductResponseJSON).toHaveProperty('title');

    const deleteProductResponseJSON = await api
      .url()
      .path('/products/1')
      .deleteRequest(200);

    expect(typeof deleteProductResponseJSON).toBe('object');
    expect(deleteProductResponseJSON).toHaveProperty('isDeleted');
    expect(deleteProductResponseJSON.isDeleted).toBe(true);
  });
});
