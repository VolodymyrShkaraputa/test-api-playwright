import { test } from '../fixtures/api';
import { expect } from '@playwright/test';

test.describe('A set of test cases for Quotes', () => {
  test('Get all quotes', async ({ api }) => {
    const getAllQuotesJSON = await api
    .url()
    .path('/quotes').getRequest(200);


    expect(Array.isArray(getAllQuotesJSON.quotes)).toBe(true);
    getAllQuotesJSON.quotes.forEach((quotes: string) => {
      expect(quotes).toHaveProperty('id');
      expect(quotes).toHaveProperty('quote');
      expect(quotes).toHaveProperty('author');
    });
  });

  test('Get a single quote', async ({ api }) => {
    const getOneQuoteJSON = await api.url().path('/quotes/1').getRequest(200);

    expect(getOneQuoteJSON).toHaveProperty('id');
    expect(getOneQuoteJSON).toHaveProperty('quote');
    expect(getOneQuoteJSON).toHaveProperty('author');
  });
});
