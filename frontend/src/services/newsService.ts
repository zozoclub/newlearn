import axiosInstance from "./axiosInstance";

export type NewsType = {
  newsId: number;
  title: string;
  content: string;
  thumbnailImageUrl: string;
  category: string;
  publishedDate: string;
  isRead: boolean[];
};

type WordType = {
  word: string;
  sentence: string;
};

export type DetailNewsType = NewsType & {
  journalist: string;
  press: string;
  originalUrl: string;
  hit: number;
  isScrapped: boolean; //유저가 이 난이도로 스크랩했는지 여부
  words: WordType[];
};

export const getTotalNewsList = async (
  difficulty: number,
  lang: string,
  page: number,
  size: number
): Promise<NewsType[]> => {
  try {
    const response = await axiosInstance.get(`news`, {
      params: {
        difficulty: difficulty,
        lang: lang,
        page: page,
        size: size,
      },
    });
    console.log(response);
    return response.data.data.content;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCategoryNewsList = async (
  difficulty: number,
  lang: string,
  page: number,
  size: number,
  category: number
): Promise<NewsType[]> => {
  try {
    const response = await axiosInstance.get(`news/${category}`, {
      params: {
        difficulty: difficulty,
        lang: lang,
        page: page,
        size: size,
      },
    });
    console.log(response);
    return response.data.data.content;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTopNewsList = async (
  difficulty: number,
  lang: string
): Promise<NewsType[]> => {
  try {
    const response = await axiosInstance.get(`news/top`, {
      params: {
        difficulty: difficulty,
        lang: lang,
      },
    });
    console.log(response);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getNewsDetail = async (
  newsId: number,
  difficulty: number,
  lang: "kr" | "en",
  isFirstView: boolean
): Promise<DetailNewsType> => {
  try {
    const response = await axiosInstance.get(`news/detail/${newsId}`, {
      params: {
        difficulty: difficulty,
        lang: lang,
        isFirstView: isFirstView,
      },
    });
    console.log(response);
    return response.data.data;
  } catch (error) {
    console.error("getNewsDetail failed: ", error);
    throw error;
  }
};

export const readNews = async (newsId: number, difficulty: number) => {
  try {
    const response = await axiosInstance.post(
      `news/read/${newsId}/${difficulty}`
    );
    console.log(response);
  } catch (error) {
    console.error("read News failed: ", error);
    throw error;
  }
};
