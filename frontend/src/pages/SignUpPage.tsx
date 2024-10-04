import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";

import Button from "@components/Button";
import NicknameInput from "@components/signuppage/NicknameInput";
import SelectCategory from "@components/signuppage/SelectCategory";
// import SelectDifficulty from "@components/signuppage/SelectDifficulty";
import SignupHeader from "@components/signuppage/SignupHeader";
import LevelTest from "@components/signuppage/LevelTest";
import { usePageTransition } from "@hooks/usePageTransition";
import {
  checkNicknameDup,
  getOAuthInformation,
  signUp,
} from "@services/userService";
import signupState from "@store/signupState";
import AvatarSetting from "@components/signuppage/AvatarSetting";
import locationState from "@store/locationState";

export type SignUpType = {
  email: string;
  name: string;
  provider: string;
  providerId: string;
  nickname: string;
  difficulty: number;
  categories: string[];
  skin: number;
  eyes: number;
  mask: number;
};

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SignUpPage = () => {
  const [signupData, setSignupData] = useRecoilState(signupState);
  const nickname = signupData.nickname;
  const categories = signupData.categories;
  const difficulty = signupData.difficulty;
  const [pageNum, setPageNum] = useState(1);

  const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean>(true);
  const [isNicknameDuplicated, setIsNicknameDuplicated] =
    useState<boolean>(false);
  const [activeButton, setActiveButton] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const query = useQuery();
  const transitionTo = usePageTransition();
  const setCurrentLocation = useSetRecoilState(locationState);

  function handleNicknameChange(newNickname: string) {
    if (newNickname.length <= 8) {
      setSignupData({ ...signupData, nickname: newNickname });
      setIsNicknameDuplicated(false); // 닉네임이 변경되면 중복 상태를 초기화
      setIsNicknameAvailable(checkNickname(newNickname));
    }
  }

  function checkNickname(nickname: string): boolean {
    if (nickname.length < 3) {
      return false;
    }
    return /^[가-힣ㄱ-ㅎㅏ-ㅣ]+$/.test(nickname);
  }

  function checkInterest(): boolean {
    return categories.length === 3;
  }

  function checkDifficulty(): boolean {
    return difficulty !== 0;
  }

  async function handleSubmitButton() {
    try {
      // true 이면 중복된 닉네임이 있는 것
      const isNicknameAvailable = await checkNicknameDup(nickname);
      console.log(isNicknameAvailable);
      if (!isNicknameAvailable) {
        await signUp(signupData);
        transitionTo("/login");
      } else {
        setPageNum(1);
        setIsNicknameDuplicated(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setCurrentLocation("signUp");
    return () => {
      setCurrentLocation("");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 주소로부터 토큰 획득
  useEffect(() => {
    const token = query.get("token");
    // 소셜 로그인이 아닌 접근 방지
    if (token === null) {
      transitionTo("login");
    }
    setToken(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // 토큰으로 유저 정보(이메일, 이름, 제공자) 가져오기
  useEffect(() => {
    const getOAuth = async () => {
      try {
        if (token !== null) {
          const response = await getOAuthInformation(token);
          setSignupData({
            ...signupData,
            email: response.email,
            name: response.name,
            provider: response.provider,
            providerId: response.providerId,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    getOAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // 유효성 검사
  useEffect(() => {
    if (nickname.length > 0 && !checkNickname(nickname)) {
      console.log("닉네임 체크");
      setIsNicknameAvailable(false);
      setActiveButton(false);
    } else if (!checkInterest()) {
      console.log("관심 카테고리 체크");
      setIsNicknameAvailable(true);
      setActiveButton(false);
    } else if (!checkDifficulty()) {
      console.log("난이도 체크");
      setIsNicknameAvailable(true);
      setActiveButton(false);
    } else {
      setIsNicknameAvailable(true);
      if (!isNicknameDuplicated) {
        setActiveButton(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nickname, categories, difficulty]);

  // 로그인이 되어있는 상태라면 메인으로 이동
  const isLogin = sessionStorage.getItem("accessToken");
  useEffect(() => {
    if (isLogin) {
      transitionTo("/");
    }
  }, [isLogin, transitionTo]);

  return (
    <Container $pageNum={pageNum}>
      <SignupHeader pageNum={pageNum} setPageNum={setPageNum} />
      <form onSubmit={(event) => event.preventDefault()}>
        <FirstPage $pageNum={pageNum}>
          {/* 아바타 */}
          <div className="desc">아바타</div>
          <AvatarSetting />
          {/* 닉네임 */}
          <NicknameInput
            isNicknameAvailable={isNicknameAvailable}
            isNicknameDuplicated={isNicknameDuplicated}
            onNicknameChange={handleNicknameChange}
          />
          <div>
            <Button
              $varient={
                isNicknameAvailable &&
                !isNicknameDuplicated &&
                nickname.length !== 0
                  ? "primary"
                  : "cancel"
              }
              size="large"
              onClick={() => {
                if (
                  isNicknameAvailable &&
                  !isNicknameDuplicated &&
                  nickname.length !== 0
                ) {
                  setPageNum(2);
                }
              }}
            >
              다음
            </Button>
          </div>
        </FirstPage>
        <SecondPage $pageNum={pageNum}>
          <LevelTest setPageNum={setPageNum} />
        </SecondPage>
        <ThirdPage $pageNum={pageNum}>
          {/* 관심 카테고리 */}
          <SelectCategory />
          {/* 영어 실력 */}
          {/* <SelectDifficulty /> */}
          {/* 입력 완료 버튼 */}
          <div>
            <Button
              $varient={activeButton ? "primary" : "cancel"}
              size="large"
              onClick={async () => {
                if (activeButton) {
                  await handleSubmitButton();
                }
              }}
            >
              입력 완료
            </Button>
          </div>
        </ThirdPage>
      </form>
    </Container>
  );
};

const Container = styled.div<{ $pageNum: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  width: 27.25rem;
  height: ${(props) => {
    switch (props.$pageNum) {
      case 1:
        return "38rem";
      case 2:
        return "44rem";
      case 3:
        return "23rem";
      default:
        return "38rem";
    }
  }};
  padding: 2rem 2rem 2rem 2rem;
  border-radius: 0.5rem;
  background-color: ${(props) => props.theme.colors.cardBackground + "7F"};
  transition: box-shadow 0.5s;
  backdrop-filter: blur(4px);
  box-shadow: ${(props) => props.theme.shadows.medium};
  transition: all 0.3s ease, height 0.3s ease;
  overflow: hidden;
  ::placeholder {
    font-weight: 600;
    color: ${(props) => props.theme.colors.placeholder};
  }
  .desc {
    display: flex;
    margin: 1.25rem 0;
    align-items: center;
    font-size: 1.25rem;
  }
  .category,
  .difficulty {
    .buttons {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 1.25rem;
      margin: 1.5rem 0 3rem 0;
    }
  }
`;

const FirstPage = styled.div<{ $pageNum: number }>`
  position: absolute;
  left: 3rem;
  transform: ${(props) => {
    switch (props.$pageNum) {
      case 1:
        return "translateX(0)";
      case 2:
        return "translateX(-31.25rem)";
      case 3:
        return "translateX(-62.5rem)";
      default:
        return "translateX(0)";
    }
  }};
  transition: transform 0.5s;
`;
const SecondPage = styled.div<{ $pageNum: number }>`
  position: absolute;
  left: 3rem;
  transform: ${(props) => {
    switch (props.$pageNum) {
      case 1:
        return "translateX(31.25rem)";
      case 2:
        return "translateX(0)";
      case 3:
        return "translateX(-31.25rem)";
      default:
        return "translateX(31.25rem)";
    }
  }};
  transition: transform 0.5s;
`;
const ThirdPage = styled.div<{ $pageNum: number }>`
  position: absolute;
  left: 3rem;
  transform: ${(props) => {
    switch (props.$pageNum) {
      case 1:
        return "translateX(62.5rem)";
      case 2:
        return "translateX(31.25rem)";
      case 3:
        return "translateX(0)";
      default:
        return "translateX(62.5rem)";
    }
  }};
  transition: transform 0.5s;
`;
export default SignUpPage;
