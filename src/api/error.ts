/**
 * 用户友好，可呈现给用户的错误类型
 */
export class UserFriendlyError extends Error {
  __USER_FRIENDLY__ = true;
}

/**
 * 接口响应业务异常
 * @extends UserFriendlyError
 */
export class ApiBusinessError extends UserFriendlyError {
  name = "ApiBusinessError";

  errcode: number;

  data?: any;

  config?: any;

  errmsg: string;

  constructor(message: string, code: number, data?: any, config?: any) {
    super(message);

    this.errcode = code;
    this.data = data;
    this.config = config;
    // 兼容
    this.errmsg = message;
  }
}

/**
 * 接口响应网络异常
 * @extends UserFriendlyError
 */
export class ApiNetError extends UserFriendlyError {
  name = "ApiNetError";

  errcode: number;

  errmsg: string;

  constructor(message: string, code: number) {
    super(message);

    this.errcode = code; // 兼容
    this.errmsg = message;
  }
}
