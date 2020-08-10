// Libs
import { AxiosInstance, AxiosResponse } from "axios";

// DTO's
import { IDictionaryDTO } from "../dto/dictionary.dto";

interface IOptions {
  params?: IDictionaryDTO<string>;
  headers?: IDictionaryDTO<string>;
}
interface IOptionsSubmit extends IOptions {
  postType?: "json" | "form";
}

interface IResponse<T> {
  headers: IDictionaryDTO<string>;
  status: number;
  body: T;
}

interface IQuerystringModule {
  stringify: (obj?: IDictionaryDTO<string | number | boolean | string[] | number[] | boolean[] | null>) => string;

}


export interface IAPIService {
  get<T>(url: string, params?: IDictionaryDTO<string>, options?: IOptions): Promise<IResponse<T>>;
  post<T, R>(url: string, body: T, options?: IOptionsSubmit): Promise<IResponse<R>>;
  put<T, R>(url: string, body: T, options?: IOptionsSubmit): Promise<IResponse<R>>;
  patch<T, R>(url: string, body: T, options?: IOptionsSubmit): Promise<IResponse<R>>;
}

export class APIService implements IAPIService {
  public constructor(
    private readonly baseUrl: string,
    private readonly axios: AxiosInstance,
    private readonly querystringModule: IQuerystringModule,
  ) {
    axios.defaults.baseURL = this.baseUrl;
  }

  public async get<T>(url: string, params?: IDictionaryDTO<string>, options?: IOptions): Promise<IResponse<T>> {
    try {
      if (options === undefined) {
        options = {};
      }
      const response: AxiosResponse<T> = await this.axios.get(url, { params, headers: options.headers });
      return {
        headers: response.headers,
        status: response.status,
        body: response.data,
      };
    } catch (error) {
      throw error;
    }
  }

  public async head(url: string, params?: IDictionaryDTO<string>, options?: IOptions): Promise<IResponse<undefined>> {
    try {
      if (options === undefined) {
        options = {};
      }
      const response: AxiosResponse<undefined> = await this.axios.head(url, { params, headers: options.headers });
      return {
        headers: response.headers,
        status: response.status,
        body: undefined,
      };
    } catch (error) {
      throw error;
    }
  }

  public async post<T, R>(url: string, body: T, options?: IOptionsSubmit): Promise<IResponse<R>> {
    return this.submitData<T, R>("post", url, body, options);
  }

  public async put<T, R>(url: string, body?: T, options?: IOptionsSubmit): Promise<IResponse<R>> {
    return this.submitData<T, R>("put", url, body, options);
  }

  public async patch<T, R>(url: string, body?: T, options?: IOptionsSubmit): Promise<IResponse<R>> {
    return this.submitData<T, R>("patch", url, body, options);
  }

  public async delete<T, R>(url: string, body?: T, options?: IOptions): Promise<void> {
    try {
      if (options === undefined) {
        options = {};
      }
      await this.axios.delete<void>(url, { params: options.params, headers: options.headers });
    } catch (error) {
      throw error;
    }
  }

  public setBaseUrl(baseUrl: string): void {
    this.axios.defaults.baseURL = baseUrl;
  }

  public setDefaultHeaders(headers: IDictionaryDTO<string>): void {
    this.axios.defaults.headers = { ...this.axios.defaults.headers, ...headers };
  }

  public removeDefaultHeaders(name: string | string[]): void {
    if (!(name instanceof Array)) { name = [name]; }
    this.axios.defaults.headers = Object.keys(this.axios.defaults.headers)
      .filter((key: string) => name.indexOf(key) === -1) // Filter out keys to remove
      .reduce((previousValue: any, key: string) => ({ // Convert array to dictionary
        ...previousValue, // Concat previous value
        [key]: this.axios.defaults.headers[key], // Add value from headers using array value as key
      }), {});
  }

  public setInterceptors(onSuccess: <T>(response: AxiosResponse<T>) => AxiosResponse<T>, onFail: (error: any) => any): void {
    this.axios.interceptors.response.use(onSuccess, onFail);
  }

  public parseToQuery(object: IDictionaryDTO<string | string[]>): string {
    const query = Object.keys(object).map((key: string) => {
      let value = object[key];
      if (!(value instanceof Array)) {
        value = [value];
      }
      return value.map((value: string) => `${key}=${value}`).join("&");
    }).join("&");
    return `${query !== "" ? "?" : ""}${query}`;
  }

  public parseFromQuery(query: string): IDictionaryDTO<string[]> {
    const match = query.match(/^([^\?]*)\??([^#]*)/);
    if (match !== null && match[2].length > 0) {
      return match[2].split("&").reduce((previousValue: IDictionaryDTO<string[]>, currentValue: string) => {
        const split = currentValue.split("=");
        return {
          ...previousValue, [split[0]]: [
            ...(previousValue[split[0]] !== undefined ? previousValue[split[0]] : []),
            ...(split[1] !== undefined ? [split[1]] : []),
          ],
        };
      }, {});
    }
    return {};
  }

  private async submitData<T extends IDictionaryDTO<any>, R>(verb: "post" | "put" | "patch", url: string, data?: T, options?: IOptionsSubmit): Promise<IResponse<R>> {
    try {
      if (options === undefined) {
        options = {};
      }
      let postData: any;
      switch (options.postType) {
        case "form":
          options.headers = { "Content-Type": "application/x-www-form-urlencoded", ...options.headers };
          postData = this.querystringModule.stringify(data);
          break;
        case "json":
          options.headers = { "Content-Type": "application/json", ...options.headers };
          break;
        default:
          postData = data;
      }

      const response: AxiosResponse<R> = await this.axios[verb](url, postData, { params: options.params, headers: options.headers });
      return {
        headers: response.headers,
        status: response.status,
        body: response.data,
      };
    } catch (error) {
      throw error;
    }
  }
}
