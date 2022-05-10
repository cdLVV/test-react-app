import request from "./request";
import { showErrMsg } from "./utils";

/**
 * q=stars:>1+language:javascript&sort=stars&order=desc&type=Repositories
 */
export interface GetSearchRepositoriesParams {
  q: string;
  sort: string;
  order: string;
  type: string;
  page: number;
}
export interface GitRepositoryItem {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  visibility: string;
  forks: number;
  open_issues: number;
  watchers: number;
  stargazers_count: number;
  watchers_count: number;
  default_branch: string;
  score: number;
  owner: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    type: string;
    site_admin: false;
  };
}
export interface GetSearchRepositoriesRes {
  items: GitRepositoryItem[];
  total_count: number;
  incomplete_results: boolean;
}

function paramsSerializer(params: any) {
  return Object.entries(params).reduce((pre, item) => {
    const [key, val] = item;
    return `${pre}${pre ? "&" : ""}${key}=${val}`;
  }, "");
}

function buildURL(url: string, params: any) {
  return `${url}?${paramsSerializer(params)}`;
}

type ReturnPromise = Promise<GetSearchRepositoriesRes> & {
  setParams: (val: GetSearchRepositoriesParams) => ReturnPromise;
  setConfig: (config: any) => ReturnPromise;
};
export function getSearchRepositories() {
  let params: GetSearchRepositoriesParams;
  let config: any = {};
  // @ts-ignore
  const returnPromise: ReturnPromise = Promise.resolve().then(() => {
    return new Promise<GetSearchRepositoriesRes>(function dispatchXhrRequest(
      resolve,
      reject
    ) {
      let xhr: XMLHttpRequest | null = new XMLHttpRequest();
      xhr.open(
        "GET",
        buildURL("https://api.github.com/search/repositories", params),
        true
      );

      xhr.responseType = "json";
      if ("setRequestHeader" in xhr) {
        xhr.setRequestHeader("Accept", "application/json, text/plain, */*");
      }

      function onloadend() {
        if (!xhr) {
          return;
        }
        let response: any;
        try {
          response =
            typeof xhr.response === "string"
              ? JSON.parse(xhr.response)
              : xhr.response;
        } catch (error) {
          response = xhr.response;
        }
        resolve(response);
        xhr = null;
      }

      if ("onloadend" in xhr) {
        xhr.onloadend = onloadend;
      } else {
        // @ts-ignore
        xhr.onreadystatechange = function handleLoad() {
          if (!xhr || xhr.readyState !== 4) {
            return;
          }
          if (
            xhr.status === 0 &&
            !(xhr.responseURL && xhr.responseURL.indexOf("file:") === 0)
          ) {
            return;
          }
          setTimeout(onloadend);
        };
      }

      xhr.onabort = function handleAbort() {
        if (!xhr) {
          return;
        }

        reject(new Error("Request aborted"));

        xhr = null;
      };

      xhr.onerror = function handleError() {
        reject(new Error("Network Error"));
        xhr = null;
      };

      xhr.ontimeout = function handleTimeout() {
        reject(new Error("timeout"));
        xhr = null;
      };

      xhr.send();
    });
  });
  returnPromise.setParams = (val: GetSearchRepositoriesParams) => {
    params = val;
    return returnPromise;
  };
  returnPromise.setConfig = (val: any) => {
    config = { ...config, ...val };
    return returnPromise;
  };
  returnPromise.catch((e) => {
    if (config.showError ?? true) {
      showErrMsg(e?.message || "请求出错了");
    }
  });

  return returnPromise;
}

// export function getSearchRepositories() {
//   return request
//     .get<GetSearchRepositoriesParams, GetSearchRepositoriesRes>(
//       "/search/repositories"
//     )
//     .setConfig({
//       baseURL: "https://api.github.com",
//       notCheckCode: true,
//       paramsSerializer: (params) =>
//         Object.entries(params).reduce((pre, item) => {
//           const [key, val] = item;
//           return `${pre}${pre ? "&" : ""}${key}=${val}`;
//         }, ""),
//     });
// }

export interface GetGithubUserRes {
  stargazers_count: number;
  avatar_url: string;
  created_at: string;
  html_url: string;
  id: number;
  login: string;
  type: string;
  updated_at: string;
  public_repos: number;
  location: string;
  following: string;
  followers: string;
}
export function getGithubUser(name: string) {
  return request.get<any, GetGithubUserRes>(`/users/${name}`).setConfig({
    baseURL: "https://api.github.com",
    notCheckCode: true,
  });
}
