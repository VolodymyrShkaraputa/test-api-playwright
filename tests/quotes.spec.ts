import { test } from '@playwright/test';
import { expect } from '@playwright/test';
import { RequestHelper } from '../utils/requestHelper';

test.describe('A set of test cases for Quotes', () => {
  test('Get all quotes', async ({ request }) => {
    const api = new RequestHelper(request, process.env.BASE_URL!);
    const getAllQuotesJSON = await api.url(process.env.BASE_URL!).path('/quotes').getRequest(200);


    expect(Array.isArray(getAllQuotesJSON.quotes)).toBe(true);
    getAllQuotesJSON.quotes.forEach((quotes: string) => {
      expect(quotes).toHaveProperty('id');
      expect(quotes).toHaveProperty('quote');
      expect(quotes).toHaveProperty('author');
    });
  });

  test('Get a single quote', async ({ request }) => {
    const api = new RequestHelper(request, process.env.BASE_URL!);
    const getOneQuoteJSON = await api.url(process.env.BASE_URL!).path('/quotes/1').getRequest(200);

    expect(getOneQuoteJSON).toHaveProperty('id');
    expect(getOneQuoteJSON).toHaveProperty('quote');
    expect(getOneQuoteJSON).toHaveProperty('author');
  });
});
