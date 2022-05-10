import request from "./request";

export interface GetNewsListParams {
  page: number;
  page_size: number;
}
export interface NewsItem {
  img: string;
  title: string;
  keyword: string;
  code: string;
}
export interface GetNewsListRes {
  data: NewsItem[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
  };
}

export function getNewsList() {
  return request.get<GetNewsListParams, GetNewsListRes>(
    "/mock/d8c33ca26a546a3c9be78ee13f714990/t1-0fficial/api/news"
  );
}

export interface GetNewsDetailByCodeRes {
  data: { code: string; text: string; title: string };
}
export function getNewsDetailByCode(code: string) {
  return request.get<any, GetNewsDetailByCodeRes>(
    `/mock/d8c33ca26a546a3c9be78ee13f714990/t1-0fficial/api/news/${code}`
  );
}
