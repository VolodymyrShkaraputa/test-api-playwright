import { APIRequestContext, expect } from '@playwright/test';

export class RequestHelper {
  private request: APIRequestContext;
  private baseUrl: string;
  private apiPath: string = '';
  private queryParams: Record<string, string> = {};
  private requestHeaders: Record<string, string> = {};
  private requestBody: object = {};

  constructor(request: APIRequestContext, apiBaseUrl: string) {
    this.request = request;
    this.baseUrl = apiBaseUrl;
  }
  url(url: string) {
    this.baseUrl = url;
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
    const response = await this.request.get(url, {
      headers: this.requestHeaders,
    });
    const responseJSON = await response.json();
    expect(response.status()).toBe(statusCode);
    return responseJSON;
  }

  async postRequest(statusCode: number) {
    const url = this.getUrl();
    const response = await this.request.post(url, {
      headers: this.requestHeaders,
      data: this.requestBody,
    });
    const responseJSON = await response.json();
    expect(response.status()).toBe(statusCode);
    return responseJSON;
  }

  async putRequest(statusCode: number) {
    const url = this.getUrl();
    const response = await this.request.put(url, {
      headers: this.requestHeaders,
      data: this.requestBody,
    });
    const responseJSON = await response.json();
    expect(response.status()).toBe(statusCode);
    return responseJSON;
  }

  async deleteRequest(statusCode: number) {
    const url = this.getUrl();
    const response = await this.request.delete(url, {
      headers: this.requestHeaders,
    });
    const responseJSON = await response.json();
    expect(response.status()).toBe(statusCode);
    return responseJSON;
  }
}
