import axios, {
  AxiosInstance,
  Canceler,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import qs from "qs";
import { ApiBusinessError, ApiNetError } from "./error";
import { showErrMsg } from "./utils";

export type RequestBaseConfig = {
  bodyType?: "formData" | "json" | "url";
  [key: string]: any;
} & AxiosRequestConfig;

export type RequestInstanceConfig = RequestBaseConfig;

const defaultRequestInstanceConfig: RequestBaseConfig = {};

export type SourceResponse<T> = AxiosResponse<T>;

export class Request<P = {}, D = {}, R = {}> {
  private config: RequestBaseConfig;

  private axiosInstance: AxiosInstance;

  // private hookConfig: HookConfig;

  private canceler?: Canceler;

  constructor(axiosInstance: AxiosInstance, config: RequestInstanceConfig) {
    const baseConfig = {
      ...defaultRequestInstanceConfig,
      ...config,
    };

    this.config = baseConfig;
    // this.hookConfig = {
    //   onSuccess,
    //   onError
    // };
    this.axiosInstance = axiosInstance;
  }

  /**
   * 同Promise.then
   * @returns {this}
   */
  then<T1 = R, T2 = never>(
    onFullfilled: ((res: R) => T1 | PromiseLike<T1>) | undefined | null,
    onReject?: ((e: any) => T2 | PromiseLike<T2>) | null | undefined
  ): Promise<T1 | T2> {
    // @ts-ignore
    return this.send().then(onFullfilled, onReject);
  }

  /**
   * 同Promise.catch
   * @returns {this}
   */
  catch<T>(onReject: (e: Error) => any): Promise<T> {
    return this.send().then(null, onReject);
  }

  /**
   * 中断当前请求
   * @returns {this}
   */
  cancel(): this {
    if (this.canceler) {
      this.canceler();
    }

    return this;
  }

  /**
   * 追加url参数
   * @param params - 数据
   * @returns {this}
   */
  appendParams(params: { [k in keyof P]?: P[k] }) {
    this.config.params = {
      ...this.config.params,
      ...params,
    };

    return this;
  }

  /**
   * 设置url参数数据
   * @param params - 数据
   * @returns {this}
   */
  setParams(params: P) {
    this.config.params = params;

    return this;
  }

  /**
   * 设置正文数据
   * @param data - 数据
   * @returns {this}
   */
  setData(data: D) {
    this.config.data = data;

    return this;
  }

  /**
   * 设置配置参数
   * @param config - 配置参数
   * @returns {this}
   */
  setConfig(config: RequestBaseConfig) {
    this.config = { ...this.config, ...config };

    return this;
  }

  /**
   * 设置 headers 参数
   * @param headers - headers 参数
   * @returns {this}
   */
  setHeaders(headers: RequestBaseConfig["headers"]) {
    this.config.headers = { ...this.config.headers, ...headers };

    return this;
  }

  /**
   * 追加正文数据
   * @param data - 数据
   * @returns {this}
   */
  appendData(data: { [k in keyof D]?: D[k] }) {
    this.config.data = {
      ...this.config.data,
      ...data,
    };

    return this;
  }

  /**
   * 发送请求
   * @returns {this}
   */
  private send() {
    this.cancel();
    const { cancel, token } = axios.CancelToken.source();

    this.config.cancelToken = token;
    this.canceler = cancel;

    if (!this.config.headers) {
      this.config.headers = {};
    }

    const config = {
      ...this.config,
    };

    if (
      config.bodyType === "formData" &&
      config.data instanceof window.FormData === false
    ) {
      const formData = new window.FormData();

      Object.keys(config.data).forEach((key) => {
        formData.append(key, config.data[key]);
      });
      config.data = formData;
    } else if (config.bodyType === "url") {
      config.data = qs.stringify(config.data);
    }

    delete config.bodyType;

    return this.axiosInstance(config);
  }
}

export class Instantce {
  axiosInstance: AxiosInstance;

  requestInstanceConfig: RequestInstanceConfig;

  constructor(
    axiosInstance: AxiosInstance,
    requestInstanceConfig: RequestInstanceConfig
  ) {
    this.axiosInstance = axiosInstance;
    this.requestInstanceConfig = requestInstanceConfig;
  }

  get = <P = {}, R = AxiosResponse<{}>>(
    url: string,
    config?: RequestBaseConfig
  ) => {
    return new Request<P, {}, R>(this.axiosInstance, {
      method: "get",
      url,
      ...this.requestInstanceConfig,
      ...config,
    });
  };

  post = <D = {}, R = AxiosResponse<{}>>(
    url: string,
    config?: RequestBaseConfig
  ) => {
    return new Request<{}, D, R>(this.axiosInstance, {
      method: "post",
      url,
      ...this.requestInstanceConfig,
      ...config,
    });
  };

  put = <D = {}, R = AxiosResponse<{}>>(
    url: string,
    config?: RequestBaseConfig
  ) => {
    return new Request<{}, D, R>(this.axiosInstance, {
      method: "put",
      url,
      ...this.requestInstanceConfig,
      ...config,
    });
  };

  delete = <P = {}, R = AxiosResponse<{}>>(
    url: string,
    config?: RequestBaseConfig
  ) => {
    return new Request<P, {}, R>(this.axiosInstance, {
      method: "delete",
      url,
      ...this.requestInstanceConfig,
      ...config,
    });
  };

  interceptor = {
    req: (func: (req: AxiosRequestConfig) => any) => {
      this.axiosInstance.interceptors.request.use(func);
    },
    res: (func: (res: AxiosResponse<any>) => any) => {
      this.axiosInstance.interceptors.response.use(func);
    },
    error: (func: (err: AxiosError<any>) => any) => {
      this.axiosInstance.interceptors.response.use(undefined, func);
    },
  };
}

function createInstance(requestInstanceConfig: RequestInstanceConfig = {}) {
  const { ...axiosConfig } = requestInstanceConfig;

  return new Instantce(axios.create(axiosConfig), requestInstanceConfig);
}

type InstanceResponse = AxiosResponse & {
  config: RequestInstanceConfig;
};
type InstanceError = AxiosError & {
  config: RequestInstanceConfig;
};

const instance = createInstance({
  // withCredentials: true,
  baseURL: "https://www.fastmock.site",
});

// 自定义request拦截器
instance.interceptor.req((config) => {
  const headers = {
    ...config.headers,
  };
  Object.keys(headers).forEach((key) => {
    if (headers[key] === undefined) delete headers[key];
  });

  return {
    ...config,
    headers,
  };
});

// 自定义response拦截器，
// 注意：如果修改接口正常返回的结构，对应的response声明需要修改
instance.interceptor.res((r) => {
  const { data, config } = r as InstanceResponse;

  if (config.notCheckCode || data.code === 200) {
    return data;
  }

  if (config.showError ?? true) {
    showErrMsg(data.desc);
  }

  return Promise.reject(
    new ApiBusinessError(data.desc, data.code, data, config)
  );
});

// 自定义异常拦截器
instance.interceptor.error((error) => {
  if (error instanceof ApiBusinessError) {
    return Promise.reject(error);
  }
  const { response, config = {} } = error as InstanceError;

  let errmsg = "请求失败，请稍后再试";
  let errcode = -255;

  if (response) {
    const { status } = response;

    errcode = status;
    switch (status) {
      case 0:
        errmsg = `请求失败，请检查网络:${errcode}`;
        break;
      case 404:
        errmsg = `您请求的地址不存在:${errcode}`;
        break;
      default:
        errmsg = `服务异常，请稍后再试:${errcode}`;
    }
  } else {
    errmsg = "请求失败，请检查网络";
  }

  if (config.showError ?? true) {
    showErrMsg(errmsg);
  }

  return Promise.reject(new ApiNetError(errmsg, errcode));
});

export default instance;
