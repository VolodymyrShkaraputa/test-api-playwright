import { test as base, expect } from '@playwright/test';
import { RequestHelper } from '../utils/requestHelper';

export const testWithAuth = base.extend<{
  accessToken: string;
  requestHelper: RequestHelper;
}>({
  accessToken: async ({ request }, use) => {
    const response = await request.post(`${process.env.BASE_URL}/user/login`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        username: process.env.BASE_USERNAME,
        password: process.env.BASE_PASSWORD,
        expiresInMins: 30,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    await use(body.accessToken);
  },

  requestHelper: async ({ request, accessToken }, use) => {
    const requestHelper = new RequestHelper(request, process.env.BASE_URL as string, accessToken);

    await use(requestHelper);
  },
});

export { expect };
