import { test as base } from '@playwright/test';
import { RequestHelper } from '../utils/requestHelper';
import { Logger } from '../utils/logger';

export type TesOptions = {
  api: RequestHelper;
};

export const test = base.extend<TesOptions>({
  api: async ({ request }, use, testInfo) => {
    if (!process.env.BASE_URL) {
      throw new Error('BASE_URL is not defined');
    }
    const baseUrl = process.env.BASE_URL;
    const logger = new Logger();
    const requestHelper = new RequestHelper(request, baseUrl, logger);
    await use(requestHelper);
        if (testInfo.status !== testInfo.expectedStatus) {
      logger.printLogs();
    }
  },
});
