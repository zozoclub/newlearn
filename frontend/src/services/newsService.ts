import axiosInstance from "./axiosInstance";

export type NewsType = {
  newsId: number;
  title: string;
  content: string;
  thumbnailImageUrl: string;
  category: string;
  publishDate: string;
  isRead: boolean[];
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
