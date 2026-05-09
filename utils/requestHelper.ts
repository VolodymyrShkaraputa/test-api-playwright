import { APIRequestContext } from '@playwright/test';
import { Logger } from './logger';
export class RequestHelper {
  private request: APIRequestContext;
  private baseUrl: string;
  private apiPath: string = '';
  private queryParams: Record<string, string> = {};
  private requestHeaders: Record<string, string> = {};
  private requestBody: object = {};
  private logger: Logger;

  constructor(request: APIRequestContext, apiBaseUrl: string, logger: Logger) {
    this.request = request;
    this.baseUrl = apiBaseUrl;
    this.logger = logger;
  }
  url() {
    if (!process.env.BASE_URL) {
      throw new Error('URL is required');
    }
    this.baseUrl = process.env.BASE_URL;
    return this;
  }

  path(path: string) {
    this.apiPath = path;
    return this;
  }

  params(params: Record<string, string>) {
    this.queryParams = params;
    return this;
  }

  headers(headers: Record<string, string>) {
    this.requestHeaders = headers;
    return this;
  }

  body(body: object) {
    this.requestBody = body;
    return this;
  }

  private getUrl() {
    const url = new URL(`${this.baseUrl}${this.apiPath}`);
    for (const [key, value] of Object.entries(this.queryParams)) {
      url.searchParams.append(key, value);
    }
    return url.toString();
  }

  async getRequest(statusCode: number) {
    const url = this.getUrl();
    this.logger.logRequest('GET', url, this.requestHeaders);
    const response = await this.request.get(url, {
      headers: this.requestHeaders,
    });
    const responseJSON = await response.json();
    this.logger.logResponse(response.status(), responseJSON);
    this.statusCheck(response.status(), statusCode, this.getRequest);
    return responseJSON;
  }

  async postRequest(statusCode: number) {
    const url = this.getUrl();
    this.logger.logRequest('POST', url, this.requestHeaders, this.requestBody);
    const response = await this.request.post(url, {
      headers: this.requestHeaders,
      data: this.requestBody,
    });
    const responseJSON = await response.json();
    this.logger.logResponse(response.status(), responseJSON);
    this.statusCheck(response.status(), statusCode, this.postRequest);
    return responseJSON;
  }

  async putRequest(statusCode: number) {
    const url = this.getUrl();
    this.logger.logRequest('PUT', url, this.requestHeaders, this.requestBody);
    const response = await this.request.put(url, {
      headers: this.requestHeaders,
      data: this.requestBody,
    });
    const responseJSON = await response.json();
    this.logger.logResponse(response.status(), responseJSON);
    this.statusCheck(response.status(), statusCode, this.putRequest);
    return responseJSON;
  }

  async deleteRequest(statusCode: number) {
    const url = this.getUrl();
    this.logger.logRequest('DELETE', url, this.requestHeaders);
    const response = await this.request.delete(url, {
      headers: this.requestHeaders,
    });
    const responseJSON = await response.json();
    this.logger.logResponse(response.status(), responseJSON);
    this.statusCheck(response.status(), statusCode, this.deleteRequest);
    return responseJSON;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  private statusCheck(actualStatus: number, expectedStatus: number, callingMethod: Function) {
    if (actualStatus !== expectedStatus) {
      const logs = this.logger.getRecentLogs();
      const error = new Error(
        `Expected status ${expectedStatus} but got ${actualStatus}. Recent logs:\n${logs}`,
      );
      Error.captureStackTrace(error, callingMethod);
      throw error;
    }
  }
}
