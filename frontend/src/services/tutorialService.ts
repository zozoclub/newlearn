import axiosInstance from "./axiosInstance";

/*
  메인 페이지 : 0
*/
export const completeTutorial = async (page: number) => {
  try {
    const response = await axiosInstance.post(`user/tutorial/complete`, null, {
      params: {
        page: page,
      },
    });
    console.log(response);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCompletedTutorial = async (page: number) => {
  try {
    const response = await axiosInstance.get(`user/tutorial/complete`, {
      params: {
        page: page,
      },
    });
    console.log(response);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
