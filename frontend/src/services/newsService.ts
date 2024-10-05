import { DetailNewsType, NewsListType, NewsType } from "types/newsType";
import axiosInstance from "./axiosInstance";

export type SearchResult = {
  text: string;
};

export const getTotalNewsList = async (
  difficulty: number,
  lang: string,
  page: number,
  size: number
): Promise<NewsListType> => {
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
    return {
      newsList: response.data.data.content,
      totalPages: response.data.data.totalPages,
    };
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
): Promise<NewsListType> => {
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
    return {
      newsList: response.data.data.content,
      totalPages: response.data.data.totalPages,
    };
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

export const searchDaumDictionary = async (
  word: string
): Promise<[SearchResult[], string[], string[]]> => {
  try {
    const response = await axiosInstance.get(`proxy`, {
      params: {
        word: word,
      },
      responseType: "text",
    });

    const parser = new DOMParser();
    const daumDocument = parser.parseFromString(response.data, "text/html");
    const searchResults = daumDocument.querySelector(".search_box");
    const searchListen = searchResults?.querySelector(".wrap_listen") || null;

    console.log(searchListen);
    const pronounceDiv = searchListen?.querySelectorAll(".txt_pronounce");
    let pronounce: string[] = [];
    if (pronounceDiv && pronounceDiv[0] && pronounceDiv[1]) {
      pronounce.push(pronounceDiv[0].innerHTML);
      pronounce.push(pronounceDiv[1].innerHTML);
    }
    pronounce = pronounce.map((str) =>
      str.replace(/<daum:[^>]+>.*?<\/daum:[^>]+>/g, "")
    );

    const audioUrl: string[] = [];
    const url = searchListen?.querySelectorAll("a");
    if (url && url[0] && url[1]) {
      audioUrl.push(url[0].getAttribute("href")!);
      audioUrl.push(url[1].getAttribute("href")!);
    }

    console.log(pronounce);

    if (searchResults) {
      const searchLi = searchResults.getElementsByTagName("li");
      const wordMeans: SearchResult[] = Array.from(searchLi).map((li) => {
        const txtSearchElements = li.getElementsByClassName("txt_search");
        return {
          text: Array.from(txtSearchElements)
            .map((txt) => txt.innerHTML.replace(/(<([^>]+)>)/gi, ""))
            .join(""),
        };
      });

      return [wordMeans, pronounce, audioUrl];
    } else {
      console.log("검색 결과가 없습니다.");
      return [[], [], []];
    }
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

export const highlightingWord = async (
  newsId: number,
  difficulty: number,
  word: string,
  wordMeaning: string,
  sentence: string,
  sentenceMeaning: string,
  pronounceUs: string,
  pronounceUk: string,
  audioUs: string,
  audioUk: string
) => {
  try {
    const response = await axiosInstance.post(`word`, {
      newsId,
      difficulty,
      word,
      wordMeaning,
      sentence,
      sentenceMeaning,
      pronounceUs,
      pronounceUk,
      audioUs,
      audioUk,
    });
    console.log(response);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const scrapNews = async (newsId: number, difficulty: number) => {
  try {
    const response = await axiosInstance.post(
      `news/scrap/${newsId}/${difficulty}`
    );
    console.log(response);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteScrapNews = async (newsId: number, difficulty: number) => {
  try {
    const response = await axiosInstance.delete(
      `news/scrap/${newsId}/${difficulty}`
    );
    console.log(response);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const searchAutoNews = async (query: string) => {
  try {
    const response = await axiosInstance.get("search/auto", {
      params: {
        query: query,
      },
    });
    console.log(response.data.data);
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
    console.log(response.data.data);
    return {
      searchResult: response.data.data.content,
      totalPages: response.data.data.totalPages,
    };
  } catch (error) {
    console.log("뉴스 검색 실패", error);
    throw error;
  }
};

export const getHybridNews = async (): Promise<NewsType[]> => {
  try {
    const response = await axiosInstance.get(`recommend/hybrid`);
    console.log(response);

    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCategoryRecommandNewsList = async (): Promise<NewsType[]> => {
  try {
    const response = await axiosInstance.get(`recommend/category`);
    console.log(response);

    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
