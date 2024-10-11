import { WordType } from "./wordType";

export type NewsType = {
  newsId: number;
  title?: string;
  titleEn?: string;
  titleKr?: string;
  content?: string;
  contentEn?: string;
  contentKr?: string;
  press?: string;
  thumbnailImageUrl: string;
  category: string;
  publishedDate: string;
  isRead: boolean[];
};

export type NewsListType = {
  newsList: NewsType[];
  totalPages: number;
};

export type DetailNewsType = NewsType & {
  journalist: string;
  press: string;
  originalUrl: string;
  hit: number;
  isScrapped: boolean; //유저가 이 난이도로 스크랩했는지 여부
  words: WordType[];
};
