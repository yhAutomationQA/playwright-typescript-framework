export type HttpHeaders = Record<string, string>;

export class HeaderManager {
  private headers: HttpHeaders = {};

  constructor(defaultHeaders?: HttpHeaders) {
    this.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...defaultHeaders,
    };
  }

  set(key: string, value: string): void {
    this.headers[key] = value;
  }

  setAuth(token: string): void {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  setApiKey(key: string): void {
    this.headers['x-api-key'] = key;
  }

  remove(key: string): void {
    delete this.headers[key];
  }

  all(): HttpHeaders {
    return { ...this.headers };
  }

  merge(additional?: HttpHeaders): HttpHeaders {
    return { ...this.headers, ...additional };
  }
}
