import axios, { AxiosError } from 'axios';
import { Agent } from 'https';

export type ApiResponse<T> = {
  status: number;
  data: T;
};

export enum HttpStatus {
  OK = 200,
  UNAUTHORIZED = 401,
  BAD_REQUEST = 400,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export class HttpRequest {
  httpsAgent: Agent = new Agent({ rejectUnauthorized: false });

  private handleRequestError(error: unknown, method: string, url: string): never {
    const axiosError = error as AxiosError;
    console.error(`Request: ${method}`);
    console.error(`Url: ${url}`);

    if (axiosError.response) {
      console.error(`Status: ${axiosError.response.status}`);
      console.error(`Status Text: ${axiosError.response.statusText}`);
      console.error(`Response Data:`, axiosError.response.data);
    } else if (axiosError.request) {
      console.error(`Network Error: No response received - check vpn or wifi connection`);
    }
    throw error;
  }

  async get<T>(
    url: string,
    headers?: { [key: string]: string },
    validateStatus: boolean = true
  ): Promise<ApiResponse<T>> {
    try {
      const { status, data } = await axios.get<T>(url, {
        headers,
        httpsAgent: this.httpsAgent,
        validateStatus: validateStatus ? undefined : () => true,
      });
      return { status, data };
    } catch (error) {
      return this.handleRequestError(error, 'Get', url);
    }
  }

  async post<T>(
    url: string,
    payload?: object,
    headers?: { [key: string]: string },
    validateStatus: boolean = true
  ): Promise<ApiResponse<T>> {
    try {
      const { status, data } = await axios.post<T>(url, payload, {
        headers,
        httpsAgent: this.httpsAgent,
        validateStatus: validateStatus ? undefined : () => true,
      });
      return { status, data };
    } catch (error) {
      return this.handleRequestError(error, 'Post', url);
    }
  }

  async postForm<T>(
    url: string,
    formData?: object,
    headers?: { [key: string]: string },
    validateStatus: boolean = true
  ): Promise<ApiResponse<T>> {
    try {
      const { status, data } = await axios.post(url, formData, {
        headers,
        httpsAgent: this.httpsAgent,
        validateStatus: validateStatus ? undefined : () => true,
      });
      return { status, data };
    } catch (error) {
      return this.handleRequestError(error, 'Post Form', url);
    }
  }

  async put<T>(
    url: string,
    payload?: object,
    headers?: { [key: string]: string },
    validateStatus: boolean = true
  ): Promise<ApiResponse<T>> {
    try {
      const { status, data } = await axios.put<T>(url, payload, {
        headers,
        httpsAgent: this.httpsAgent,
        validateStatus: validateStatus ? undefined : () => true,
      });
      return { status, data };
    } catch (error) {
      return this.handleRequestError(error, 'Put', url);
    }
  }

  async delete<T>(
    url: string,
    headers?: { [key: string]: string },
    validateStatus: boolean = true
  ): Promise<ApiResponse<T>> {
    try {
      const { status, data } = await axios.delete<T>(url, {
        headers,
        httpsAgent: this.httpsAgent,
        validateStatus: validateStatus ? undefined : () => true,
      });
      return { status, data };
    } catch (error) {
      return this.handleRequestError(error, 'Delete', url);
    }
  }
}
