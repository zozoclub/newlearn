import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import Button from "@components/Button";
import NicknameInput from "@components/signuppage/NicknameInput";
import SelectCategory from "@components/signuppage/SelectCategory";
import SelectDifficulty from "@components/signuppage/SelectDifficulty";
import SignupHeader from "@components/signuppage/SignupHeader";
import { usePageTransition } from "@hooks/usePageTransition";
import {
  checkNicknameDup,
  getOAuthInformation,
  signUp,
} from "@services/userService";
import signupState from "@store/signupState";
import AvatarSetting from "@components/signuppage/AvatarSetting";

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

  function checkNickname(): boolean {
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
    if (activeButton) {
      try {
        if (await checkNicknameDup(nickname)) {
          signUp(signupData);
          transitionTo("/login");
        } else {
          setPageNum(1);
          setIsNicknameDuplicated(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

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
    if (nickname.length > 0 && !checkNickname()) {
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
          {/* 관심 카테고리 */}
          <SelectCategory />
          {/* 영어 실력 */}
          <SelectDifficulty />
          {/* 입력 완료 버튼 */}
          <div>
            <Button
              $varient={activeButton ? "primary" : "cancel"}
              size="large"
              onClick={handleSubmitButton}
            >
              입력 완료
            </Button>
          </div>
        </SecondPage>
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
  height: ${(props) => (props.$pageNum === 2 ? "33rem" : "38rem")};
  padding: 2rem 2rem 2rem 2rem;
  border-radius: 0.5rem;
  background-color: ${(props) => props.theme.colors.cardBackground + "7F"};
  transition: box-shadow 0.5s;
  backdrop-filter: blur(4px);
  box-shadow: 0.5rem 0.5rem 0.25rem ${(props) => props.theme.colors.shadow};
  transition: all 0.5s;
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
  transform: ${(props) =>
    props.$pageNum === 1 ? "translateX(0)" : "translateX(-31.25rem)"};
  transition: transform 0.5s;
`;
const SecondPage = styled.div<{ $pageNum: number }>`
  position: absolute;
  left: 3rem;
  transform: ${(props) =>
    props.$pageNum === 1 ? "translateX(31.25rem)" : "translateX(0)"};
  transition: transform 0.5s;
`;

export default SignUpPage;
