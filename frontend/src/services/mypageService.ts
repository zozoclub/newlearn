import axiosInstance from "./axiosInstance";

export type GrassType = {
  date: string;
  count: number;
};

export type StudyProgressType = {
  goalReadNewsCount: number;
  goalPronounceTestScore: number;
  goalCompleteWord: number;
  currentReadNewsCount: number;
  currentPronounceTestScore: number;
  currentCompleteWord: number;
};

export const getScrapNews = async (difficulty: number) => {
  try {
    const response = await axiosInstance.get(`mypage/news/${difficulty}`);
    return response.data;
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

export const getUserChart = async () => {
  try {
    const response = await axiosInstance.get("mypage/chart");
    return response.data.data;
  } catch (error) {
    console.log("get user chart Failed", error);
  }
};
