import axios from "axios";

type UserInfo = {
  email: string;
  name: string;
  provider: "kakao" | "naver";
  providerId: string;
};
type LoginResponse = {
  accessToken: string;
  userInfo: UserInfo;
};

export const naverLogin = async () => {
  try {
    const response = await axios.get(`oauth/login/naver`);
    window.location.href = response.data.url;
  } catch (error) {
    console.error("naver Login failed:", error);
    throw error;
  }
};

export const getOAuthAccessToken = async (
  code: string
): Promise<LoginResponse> => {
  try {
    const response = await axios.get(`oauth/get-user-token`, {
      params: {
        code,
      },
    });
    console.log(response);
    const accessToken = response.data.accessToken;
    let userInfo: UserInfo;
    if (accessToken) {
      userInfo = await getOAuthInformation(accessToken);
      sessionStorage.setItem("accessToken", accessToken);
    } else {
      console.error("No access Token received from server");
      throw new Error("No access Token received from server");
    }
    return { accessToken, userInfo };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getOAuthInformation = async (token: string): Promise<UserInfo> => {
  try {
    const response = await axios.get(`oauth/get-oauth-info`, {
      params: {
        token,
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("getOAuthInformation failed:", error);
    throw error;
  }
};
