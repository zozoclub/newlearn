import axiosInstance from "./axiosInstance";
import { StudyProgressType } from "@store/goalState";

export type GoalSettingType = {
  goalReadNewsCount: number;
  goalPronounceTestScore: number;
  goalCompleteWord: number;
};

export const goalSetting = async (data: GoalSettingType) => {
  try {
    const response = await axiosInstance.post("study/goal", data);
    console.log(data);
    return response.data;
  } catch (error) {
    console.error("goal setting Failed", error);
    throw error;
  }
};

export const getStudyProgress = async (): Promise<StudyProgressType> => {
  try {
    const response = await axiosInstance.get("study/progress");
    return response.data.data;
  } catch (error) {
    console.log("get study progree Failed", error);
    throw error;
  }
};
