import {
  PointRankingType,
  ReadRankingType,
} from "@components/mainpage/RankingWidget";
import axios from "axios";

export const getPointRankingList = async (): Promise<PointRankingType[]> => {
  try {
    const response = await axios.get(`/rank/point`);
    console.log(response);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getReadRankingList = async (): Promise<ReadRankingType[]> => {
  try {
    const response = await axios.get(`/rank/read`);
    console.log(response);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
