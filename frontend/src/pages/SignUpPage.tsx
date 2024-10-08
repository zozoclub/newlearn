import { startTransition, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";

import Button from "@components/Button";
import NicknameInput from "@components/signuppage/NicknameInput";
import SelectCategory from "@components/signuppage/SelectCategory";
import SignupHeader from "@components/signuppage/SignupHeader";
import LevelTest from "@components/signuppage/LevelTest";
import { usePageTransition } from "@hooks/usePageTransition";
import {
  checkNicknameDup,
  getOAuthInformation,
  kakaoLogin,
  naverLogin,
  signUp,
} from "@services/userService";
import AvatarSetting from "@components/signuppage/AvatarSetting";
import locationState from "@store/locationState";
import {
  checkState,
  nicknameDupState,
  oAuthInfoState,
  signUpState,
} from "@store/signUpState";

const SignUpPage = () => {
  const [pageNum, setPageNum] = useState(1);
  const [activeButton, setActiveButton] = useState(false);
  const setCurrentLocation = useSetRecoilState(locationState);
  const [searchParams] = useSearchParams();
  const signUpValue = useRecoilValue(signUpState);
  const checkValue = useRecoilValue(checkState);
  const setOAuthInfoData = useSetRecoilState(oAuthInfoState);
  const [nicknameDupValue, setNicknameDupState] =
    useRecoilState(nicknameDupState);

  const token = searchParams.get("token");
  const transitionTo = usePageTransition();

  // 입력 완료 버튼
  const handleSubmitButton = async () => {
    const isNicknameDuplicated = await checkNicknameDup(signUpValue.nickname);
    setNicknameDupState(isNicknameDuplicated);
    if (nicknameDupValue) {
      setPageNum(1);
    } else {
      await signUp(signUpValue);
      if (signUpValue.provider === "kakao") {
        kakaoLogin();
      } else {
        naverLogin();
      }
    }
  };

  // 다음 버튼
  const handleNextButton = () => {
    startTransition(() => {
      if (
        checkValue.isNicknameAvailable &&
        !nicknameDupValue &&
        signUpValue.nickname.length !== 0
      ) {
        setPageNum(2);
      }
    });
  };

  useEffect(() => {
    setCurrentLocation("signUp");
    const accessToken = sessionStorage.getItem("accessToken");
    // 로그인이 되어있는 상태라면 메인으로 이동
    if (accessToken) {
      transitionTo("/");
    }
    return () => {
      setCurrentLocation("");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 토큰으로 유저 정보(이메일, 이름, 제공자) 가져오기
  useEffect(() => {
    const getOAuth = async (token: string) => {
      try {
        const response = await getOAuthInformation(token);
        setOAuthInfoData({
          email: response.email,
          name: response.name,
          provider: response.provider,
          providerId: response.providerId,
        });
      } catch (error) {
        console.error(error);
      }
    };
    if (token) {
      getOAuth(token);
    } else {
      transitionTo("login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    setActiveButton(
      checkValue.isCategoriesSelected &&
        checkValue.isDifficultySelected &&
        checkValue.isNicknameAvailable &&
        !nicknameDupValue
    );
  }, [checkValue, nicknameDupValue]);

  return (
    <Container $pageNum={pageNum}>
      <SignupHeader pageNum={pageNum} setPageNum={setPageNum} />
      <form onSubmit={(event) => event.preventDefault()}>
        <PageContainer>
          <Page $pageNum={pageNum}>
            {/* 아바타 */}
            <div className="desc">아바타</div>
            <AvatarSetting />
            {/* 닉네임 */}
            <NicknameInput />
            <Button
              $varient={
                checkValue.isNicknameAvailable &&
                !nicknameDupValue &&
                signUpValue.nickname.length !== 0
                  ? "primary"
                  : "cancel"
              }
              size="large"
              onClick={handleNextButton}
            >
              다음
            </Button>
          </Page>
          <Page $pageNum={pageNum}>
            <LevelTest setPageNum={setPageNum} />
          </Page>
          <Page $pageNum={pageNum}>
            {/* 관심 카테고리 */}
            <SelectCategory />
            {/* 입력 완료 버튼 */}
            <Button
              $varient={activeButton ? "primary" : "cancel"}
              size="large"
              onClick={() => {
                if (activeButton) {
                  handleSubmitButton();
                }
              }}
            >
              입력 완료
            </Button>
          </Page>
        </PageContainer>
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
  padding: 2rem;
  border-radius: 0.5rem;
  background-color: ${(props) => props.theme.colors.cardBackground + "7F"};
  backdrop-filter: blur(4px);
  box-shadow: ${(props) => props.theme.shadows.medium};
  transition: all 0.3s ease;
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

const PageContainer = styled.div`
  display: flex;
`;

const Page = styled.div<{ $pageNum: number }>`
  position: relative;
  width: 25.25rem;
  padding: 0 3rem;
  transform: translateX(${(props) => -31.25 * (props.$pageNum - 2)}rem);
  transition: transform 0.5s;
`;

export default SignUpPage;
