import { test as base } from '@playwright/test';
import { RequestHelper } from '../utils/requestHelper';

export type TesOptions = {
  api: RequestHelper;
};

export const test = base.extend<TesOptions>({
  api: async ({ request }, use) => {
    if (!process.env.BASE_URL) {
      throw new Error('BASE_URL is not defined');
    }
    const baseUrl = process.env.BASE_URL;
    const requestHelper = new RequestHelper(request, baseUrl);
    await use(requestHelper);
  },
});
