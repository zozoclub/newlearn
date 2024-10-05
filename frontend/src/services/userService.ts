import axios from "axios";
import axiosInstance from "./axiosInstance";
import { SetterOrUpdater } from "recoil";
import { ExpType } from "@store/expState";
import { AvatarType } from "@components/common/Avatar";
import { SignUpStateType } from "types/signUpType";
import { userInfoType } from "@store/userInfoState";

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

export const kakaoLogin = async () => {
  try {
    const response = await axios.get(`oauth/login/kakao`);
    console.log(response);
    window.location.replace(response.data.url);
  } catch (error) {
    console.error("kakao Login failed:", error);
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
    // console.log(response);
    const accessToken = response.data.data.accessToken;
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
    // console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("getOAuthInformation failed:", error);
    throw error;
  }
};

export const checkNicknameDup = async (nickname: string): Promise<boolean> => {
  console.log(nickname);
  try {
    const response = await axios.get(`user/check/${nickname}`);
    console.log("api", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const signUp = async (signUpForm: SignUpStateType) => {
  console.log(signUpForm);
  try {
    const response = await axios.post(`user/sign-up`, {
      email: signUpForm.email,
      name: signUpForm.name,
      provider: signUpForm.provider,
      providerId: signUpForm.providerId,
      nickname: signUpForm.nickname,
      difficulty: signUpForm.difficulty,
      categories: signUpForm.categories,
      skin: signUpForm.skin,
      eyes: signUpForm.eyes,
      mask: signUpForm.mask,
    });
    console.log(response);
  } catch (error) {
    console.log("signUp failed: ", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await axiosInstance.post(`user/logout`, "");
    console.log(response);
  } catch (error) {
    console.error("logout failed: ", error);
    throw error;
  }
};

export const getUserInfo = async (): Promise<userInfoType> => {
  try {
    const response = await axiosInstance.get(`user/profile`);
    return response.data.data;
  } catch (error) {
    console.error("logout failed: ", error);
    throw error;
  }
};

export const putExpUp = async (
  experience: number,
  setExpModal: SetterOrUpdater<ExpType>,
  action: string
): Promise<void> => {
  try {
    console.log(experience);

    const response = await axiosInstance.put(`user/update-experience`, {
      experience,
    });
    // 성공하면 모달을 표시
    setExpModal({
      isOpen: true,
      experience: experience,
      action: `${action}`,
    });

    console.log("경험치 api", response);
  } catch (error) {
    console.error(`경험치 상승 오류`, error);
  }
};

export const getUserAvatar = async (userId: number): Promise<AvatarType> => {
  try {
    const response = await axiosInstance.get(`user/avatar/${userId}`);
    console.log(response);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
