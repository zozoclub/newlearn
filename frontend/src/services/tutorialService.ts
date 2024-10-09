import axiosInstance from "./axiosInstance";

/*
  메인 페이지 : 0
  뉴스 목록 페이지 : 1
  뉴스 상세 페이지 : 2
  단어장 : 3
  단어 테스트 : 4
  발음 테스트 : 5
  마이 페이지 : 6
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

export const cancelTutorial = async (page: number) => {
  try {
    const response = await axiosInstance.post(`user/tutorial/cancel`, null, {
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
