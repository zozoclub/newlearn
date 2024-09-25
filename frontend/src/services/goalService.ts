import axiosInstance from "./axiosInstance";

export type GoalSettingProps = {
  goalReadNewsCount: number;
  goalPronounceTestScore: number;
  goalCompleteWord: number;
};

export type StudyProgressProps = {
  goalReadNewsCount: number;
  goalPronounceTestScore: number;
  goalCompleteWord: number;
  currentReadNewsCount: number;
  currentPronounceTestScore: number;
  currentCompleteWord: number;
};

export const goalSetting = async (data: GoalSettingProps) => {
  try {
    const response = await axiosInstance.post("study/goal", data);
    console.log(data);
    return response.data;
  } catch (error) {
    console.error("goal setting Failed", error);
    throw error;
  }
};

export const getStudyProgress = async () => {
  try {
    const response = await axiosInstance.get("study/progress");
    return response.data.data;
  } catch (error) {
    console.log("get study progree Failed", error);
  }
};
