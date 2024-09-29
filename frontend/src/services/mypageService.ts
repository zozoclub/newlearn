import axiosInstance from "./axiosInstance";

export type ScrapNewsType = {
  newsId: number;
  title: string;
  content: string;
  thumbnailImageUrl: string;
  category: string;
  publishedDate: string;
  isRead: boolean[];
  scrapedDate: string;
};

export type GrassType = {
  date: string;
  count: number;
};

export type CategoryCountKey =
  | "economyCount"
  | "politicsCount"
  | "societyCount"
  | "cultureCount"
  | "scienceCount"
  | "worldCount";

export type CategoryCountType = {
  [K in CategoryCountKey]: number;
};

export const getLabelFromKey = (key: CategoryCountKey): string => {
  const labelMap: Record<typeof key, string> = {
    economyCount: "경제",
    politicsCount: "정치",
    societyCount: "사회",
    cultureCount: "생활/문화",
    scienceCount: "IT/과학",
    worldCount: "세계",
  };
  return labelMap[key] || key;
};

export const getScrapNewsList = async (
  difficulty: number,
  size: number,
  page: number
): Promise<ScrapNewsType[]> => {
  try {
    const response = await axiosInstance.get(`mypage/news/${difficulty}`, {
      params: {
        difficulty: difficulty,
        page: page,
        size: size,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("get scrap news Failed", error);
    throw error;
  }
};

export const getUserGrass = async (): Promise<GrassType[]> => {
  try {
    const response = await axiosInstance.get("mypage/grass");
    return response.data.data;
  } catch (error) {
    console.log("get user grass Failed", error);
    throw error;
  }
};

export const getUserChart = async (): Promise<CategoryCountType> => {
  try {
    const response = await axiosInstance.get("mypage/chart");
    return response.data.data;
  } catch (error) {
    console.log("get user chart Failed", error);
    throw error;
  }
};

export const changeNickname = async (nickname: string) => {
  try {
    const response = await axiosInstance.put("user/update-nickname", {
      nickname: nickname,
    });
    return response.data;
  } catch (error) {
    console.log("update nickname Failed", error);
    throw error;
  }
};

export const changeDifficulty = async (difficulty: number) => {
  try {
    const response = await axiosInstance.put("user/update-difficulty", {
      difficulty: difficulty,
    });
    return response.data;
  } catch (error) {
    console.log("update difficulty Failed", error);
    throw error;
  }
};

export const changeInterests = async (categories: string[]) => {
  try {
    const response = await axiosInstance.put("user/update-interest", {
      categories: categories,
    });
    return response.data;
  } catch (error) {
    console.log("update interests Failed", error);
    throw error;
  }
};

export const changeAvatar = async (
  skin: number,
  eyes: number,
  mask: number
) => {
  try {
    const response = await axiosInstance.put("user/update-avatar", {
      skin: skin,
      eyes: eyes,
      mask: mask,
    });
    return response.data;
  } catch (error) {
    console.log("update avatar Failed", error);
    throw error;
  }
};
