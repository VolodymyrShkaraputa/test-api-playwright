import { APIRequestContext } from "@playwright/test";

export class RequestHelper {
  private request: APIRequestContext;
  private baseUrl: string;
  private apiPath: string = '';
  private queryParams: object = {};
  private requestHeaders: object = {};
  private requestBody: object = { };

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

  params(params: object) {
    this.queryParams = params;
    return this;
  }

  headers(headers: object) {
    this.requestHeaders = headers;
    return this;
  }

  body(body: object) {
    this.requestBody = body;
    return this;
  }

private getUrl() {
    const url = new URL(`${this.baseUrl}${this.apiPath}`)
    for( const [key,value] of Object.entries(this.queryParams)) {
      url.searchParams.append(key,value)
    }
    return url.toString()
  }

  getRequest() {
    const url = this.getUrl()
  }
}
