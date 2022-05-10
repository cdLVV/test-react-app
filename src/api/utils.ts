import { notification } from "antd";

export function showErrMsg(msg: string, title?: string) {
  //   alert(msg);
  notification.error({
    top: 80,
    message: title || "请求错误",
    description: `原因：${msg}`,
  });
}
