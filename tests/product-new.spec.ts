import { test, expect } from '@playwright/test';

test.describe('Test suite for checking API requests for products', () => {
  test('Get products by limit', async ({ request }) => {
    type Product = {
      id: number;
      price: number;
      category: string;
    };

    type ResponseBody = {
      products: Product[];
      limit: number;
      skip: number;
      total: number;
    };

    const response = await request.get(`${process.env.BASE_URL}/products?limit=10`);
    const responseJSON = (await response.json()) as ResponseBody;

    expect(response.status()).toBe(200);
    expect(Array.isArray(responseJSON.products)).toBe(true);

    responseJSON.products.forEach((product) => {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('category');
    });

    expect(responseJSON.limit).toBe(10);
    expect(responseJSON.products.length).toBeLessThanOrEqual(responseJSON.limit);
  });

  test('Get a single product', async ({ request }) => {
    const response = await request.get(`${process.env.BASE_URL}/products/1`);
    const responseJSON = await response.json();

    expect(response.status()).toBe(200);
    expect(typeof responseJSON).toBe('object');
    expect(responseJSON).toHaveProperty('id');
    expect(responseJSON).toHaveProperty('price');
    expect(responseJSON).toHaveProperty('category');
  });

  test('Search product', async ({ request }) => {
    const responseSearch = await request.get(
      `${process.env.BASE_URL}/products/search?q=phone&limit=10`,
    );
    const responseSearchJSON = await responseSearch.json();

    expect(responseSearch.status()).toBe(200);
    expect(typeof responseSearchJSON).toBe('object');
    expect(Array.isArray(responseSearchJSON.products)).toBe(true);
    responseSearchJSON.products.forEach((searchProduct: string) => {
      expect(searchProduct).toHaveProperty('id');
      expect(searchProduct).toHaveProperty('price');
      expect(searchProduct).toHaveProperty('category');
    });
  });

  test('Limit and skip products', async ({ request }) => {
    const responseLimitProducts = await request.get(
      `${process.env.BASE_URL}/products?limit=10&skip=10&select=title`,
    );
    const responseLimitProductsJSON = await responseLimitProducts.json();

    expect(responseLimitProducts.status()).toBe(200);
    expect(typeof responseLimitProductsJSON).toBe('object');
    expect(Array.isArray(responseLimitProductsJSON.products)).toBe(true);
    responseLimitProductsJSON.products.forEach((searchProduct: string) => {
      expect(searchProduct).toHaveProperty('id');
      expect(searchProduct).toHaveProperty('title');
    });
  });

  test('Sort products', async ({ request }) => {
    const sortResponse = await request.get(
      `${process.env.BASE_URL}/products?sortBy=title&order=asc&limit=10`,
    );
    const sortResponseJSON = await sortResponse.json();

    expect(sortResponse.status()).toBe(200);
    expect(typeof sortResponseJSON).toBe('object');
    expect(Array.isArray(sortResponseJSON.products)).toBe(true);
    sortResponseJSON.products.forEach((sortBy: string) => {
      expect(sortBy).toHaveProperty('id');
      expect(sortBy).toHaveProperty('category');
      expect(sortBy).toHaveProperty('price');
    });
  });

  test('Get all products categories', async ({ request }) => {
    const getAllCategoriesResponse = await request.get(
      `${process.env.BASE_URL}/products/categories`,
    );
    const getAllCategoriesResponseJSON = await getAllCategoriesResponse.json();

    expect(getAllCategoriesResponse.status()).toBe(200);
    expect(Array.isArray(getAllCategoriesResponseJSON)).toBe(true);
    getAllCategoriesResponseJSON.forEach((categories: string) => {
      expect(categories).toHaveProperty('slug');
      expect(categories).toHaveProperty('name');
      expect(categories).toHaveProperty('url');
    });
  });

  test('Get products category list', async ({ request }) => {
    const getProductsCategoryListRes = await request.get(
      `${process.env.BASE_URL}/products/category-list`,
    );
    const getProductsCategoryListResJSON = await getProductsCategoryListRes.json();

    expect(typeof getProductsCategoryListRes).toBe('object');
    expect(getProductsCategoryListRes.status()).toBe(200);
    expect(Array.isArray(getProductsCategoryListResJSON)).toBe(true);
  });

  test('Get products by a category', async ({ request }) => {
    const getProductByCategoryRes = await request.get(
      `${process.env.BASE_URL}/products/category/smartphones?limit=10`,
    );
    const getProductByCategoryResJSON = await getProductByCategoryRes.json();

    expect(getProductByCategoryRes.status()).toBe(200);
    expect(typeof getProductByCategoryResJSON).toBe('object');
    expect(Array.isArray(getProductByCategoryResJSON.products)).toBe(true);
    getProductByCategoryResJSON.products.forEach((productsCategory: string) => {
      expect(productsCategory).toHaveProperty('id');
      expect(productsCategory).toHaveProperty('title');
      expect(productsCategory).toHaveProperty('category');
    });
  });

  test('Add a new product', async ({ request }) => {
    const newProductResponse = await request.post(`${process.env.BASE_URL}/products/add`, {
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({
        title: 'test-product',
      }),
    });
    const newProductResponseJSON = await newProductResponse.json();
    expect(newProductResponse.status()).toBe(201);
    expect(typeof newProductResponseJSON).toBe('object');
    expect(newProductResponseJSON).toHaveProperty('id');
    expect(newProductResponseJSON).toHaveProperty('title');
  });

  test('Update a product', async ({ request }) => {
    const newProductResponse = await request.put(`${process.env.BASE_URL}/products/1`, {
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({
        title: 'iPhone Galaxy-UPDATED',
      }),
    });
    const newProductResponseJSON = await newProductResponse.json();
    expect(newProductResponse.status()).toBe(200);
    expect(typeof newProductResponseJSON).toBe('object');
    expect(newProductResponseJSON).toHaveProperty('id');
    expect(newProductResponseJSON).toHaveProperty('title');
  });

  test('Delete a product', async ({ request }) => {
    const newProductResponse = await request.delete('https://dummyjson.com/products/1');
    const newProductResponseJSON = await newProductResponse.json();
    expect(newProductResponse.status()).toBe(200);
    expect(newProductResponseJSON).toHaveProperty('isDeleted');
    expect(newProductResponseJSON.isDeleted).toBe(true);
  });
});
