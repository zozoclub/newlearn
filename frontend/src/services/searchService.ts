import axiosInstance from "./axiosInstance";

export const searchAutoNews = async (query: string) => {
  try {
    const response = await axiosInstance.get("search/auto", {
      params: {
        query: query,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("뉴스 자동 검색 실패", error);
    throw error;
  }
};

export const searchNews = async (
  query: string,
  difficulty: number,
  page: number,
  size: number
) => {
  try {
    const response = await axiosInstance.get("search", {
      params: {
        query: query,
        difficulty: difficulty,
        page: page,
        size: size,
      },
    });
    return {
      searchResult: response.data.data.content,
      totalPages: response.data.data.totalPages,
    };
  } catch (error) {
    console.log("뉴스 검색 실패", error);
    throw error;
  }
};

export const getWordCloud = async () => {
  try {
    const response = await axiosInstance.get("search/aggregate");
    console.log("cloud", response.data.data.popular_keywords_eng);
    return response.data.data.popular_keywords_eng;
  } catch (error) {
    console.log("워드 클라우드 단어 가져오기 실패", error);
    throw error;
  }
};
