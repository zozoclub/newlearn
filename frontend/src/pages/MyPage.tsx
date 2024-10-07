import styled, { keyframes } from "styled-components";
import { useMediaQuery } from "react-responsive";
import MyPageProfile from "@components/mypage/MyPageProfile";
import MyPageInfo from "@components/mypage/MyPageInfo";
import MyPageCount from "@components/mypage/MyPageCount";
import MyPageCategory from "@components/mypage/MyPageCategory";
import MyPageGrass from "@components/mypage/MyPageGrass";
import MyPageScrapNews from "@components/mypage/MyPageScrapNews";

import FullLogo from "@components/common/FullLogo";

import arrowIcon from "@assets/icons/mobile/arrowIcon.svg";
import MyPageProfileMobile from "@components/mypage/mobile/MyPageProfileMobile";
import MyPageCountMobile from "@components/mypage/mobile/MyPageCountMobile";
import { useEffect, useState } from "react";
import Goal from "@components/mystudypage/Goal";
import { logout, deleteUser } from "@services/userService";
import { createGlobalStyle } from "styled-components";
import { usePageTransition } from "@hooks/usePageTransition";
import Modal from "@components/Modal";
import backArrowIcon from "@assets/icons/mobile/backArrowIcon.svg";

const BodyScrollLock = createGlobalStyle`
  body {
    overflow: hidden;
  }
`;

const MyPage = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const transitionTo = usePageTransition();
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isScrapNewsModalOpen, setIsScrapNewsModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);

  const handleChartModal = () => {
    setIsChartModalOpen(true);
  };

  const handleProgressModal = () => {
    setIsProgressModalOpen(true);
  };

  const handleScrapNewsModal = () => {
    setIsScrapNewsModalOpen(true);
  };

  // 로그아웃
  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      sessionStorage.removeItem("accessToken");
      setIsLogoutModalOpen(false);
      history.pushState(null, "", location.href);
      window.onpopstate = function () {
        history.go(-2);
      };
      transitionTo("/login");
    } catch (error) {
      console.log("로그아웃 오류 발생", error);
    }
  };

  // 회원 탈퇴

  const handleDeleteClick = () => {
    setIsDeleteUserModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteUser();
      sessionStorage.removeItem("accessToken");
      setIsDeleteUserModalOpen(false);
      history.pushState(null, "", location.href);
      window.onpopstate = function () {
        history.go(-2);
      };
      transitionTo("/login");
    } catch (error) {
      console.log("로그아웃 오류 발생", error);
    }
  };

  useEffect(() => {
    if (isChartModalOpen || isProgressModalOpen || isScrapNewsModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isChartModalOpen, isProgressModalOpen, isScrapNewsModalOpen]);

  const MobileRender = () => {
    return (
      <PageWrapper>
        <HeaderContainer>
          <FullLogo width={220} height={70} />
        </HeaderContainer>
        <ContentWrapper>
          <MyPageContainer>
            <MyPageProfileMobile />
            <WidgetContainer>
              <MyPageCountMobile />
            </WidgetContainer>
            <WidgetContainer>
              <MyPageInfo />
            </WidgetContainer>
            <WidgetMenuContainer onClick={handleChartModal}>
              <MenuTitle>학습 통계</MenuTitle>
              <img src={arrowIcon} alt="버튼" />
            </WidgetMenuContainer>
            <WidgetMenuContainer onClick={handleProgressModal}>
              <MenuTitle>이 달의 학습 현황</MenuTitle>
              <img src={arrowIcon} alt="버튼" />
            </WidgetMenuContainer>
            <WidgetMenuContainer onClick={handleScrapNewsModal}>
              <MenuTitle>내가 스크랩한 뉴스</MenuTitle>
              <img src={arrowIcon} alt="버튼" />
            </WidgetMenuContainer>
            <UserButton onClick={handleLogoutClick}>로그아웃</UserButton>
            <UserButton onClick={handleDeleteClick}>회원탈퇴</UserButton>
          </MyPageContainer>
          {isChartModalOpen && (
            <>
              <BodyScrollLock />
              <FullScreenModal $isVisible={isChartModalOpen}>
                <ModalHeader>
                  <BackButton
                    onClick={() => {
                      setIsChartModalOpen(false);
                    }}
                  >
                    <img src={backArrowIcon} alt="버튼" />
                  </BackButton>
                  <ModalTitle>마이 페이지</ModalTitle>
                </ModalHeader>
                <ModalContent>
                  <ItemTitle>
                    {new Date().getFullYear()} Contribution Graph
                  </ItemTitle>
                  <MyPageGrass />
                  <Divider />
                  <ItemTitle>Category Chart</ItemTitle>
                  <MyPageCategory />
                </ModalContent>
              </FullScreenModal>
            </>
          )}
          {isProgressModalOpen && (
            <>
              <BodyScrollLock />
              <FullScreenModal $isVisible={isProgressModalOpen}>
                <ModalHeader>
                  <BackButton
                    onClick={() => {
                      setIsProgressModalOpen(false);
                    }}
                  >
                    <img src={backArrowIcon} alt="버튼" />
                  </BackButton>
                  <ModalTitle>마이 페이지</ModalTitle>
                </ModalHeader>
                <ModalContent>
                  <Goal />
                </ModalContent>
              </FullScreenModal>
            </>
          )}
          {isScrapNewsModalOpen && (
            <>
              <BodyScrollLock />
              <FullScreenModal $isVisible={isScrapNewsModalOpen}>
                <ModalHeader>
                  <BackButton
                    onClick={() => {
                      setIsScrapNewsModalOpen(false);
                    }}
                  >
                    <img src={backArrowIcon} alt="버튼" />
                  </BackButton>
                  <ModalTitle>마이 페이지</ModalTitle>
                </ModalHeader>
                <ModalContent>
                  <MyPageScrapNews />
                </ModalContent>
              </FullScreenModal>
            </>
          )}
          <Modal
            isOpen={isLogoutModalOpen}
            onClose={() => setIsLogoutModalOpen(false)}
            title=""
          >
            <LogoutModalContent>
              <p>로그아웃 하시겠습니까?</p>
              <ButtonContainer>
                <ConfirmButton onClick={handleLogout}>확인</ConfirmButton>
              </ButtonContainer>
            </LogoutModalContent>
          </Modal>
          <Modal
            isOpen={isDeleteUserModalOpen}
            onClose={() => setIsDeleteUserModalOpen(false)}
            title=""
          >
            <LogoutModalContent>
              <p>정말 회원 탈퇴 하시겠습니까?</p>
              <ButtonContainer>
                <ConfirmButton onClick={handleDelete}>확인</ConfirmButton>
              </ButtonContainer>
            </LogoutModalContent>
          </Modal>
        </ContentWrapper>
      </PageWrapper>
    );
  };

  const DesktopRender = () => {
    return (
      <MyPageContainer>
        <FlexContainer>
          <FlexItem $flex={5}>
            <WidgetContainer>
              <MyPageProfile />
            </WidgetContainer>
          </FlexItem>
          <FlexItem $flex={4}>
            <WidgetContainer>
              <MyPageInfo />
            </WidgetContainer>
          </FlexItem>
          <FlexItem $flex={3}>
            <WidgetContainer>
              <MyPageCount />
            </WidgetContainer>
          </FlexItem>
        </FlexContainer>
        <FlexContainer>
          <FlexItem $flex={7}>
            <WidgetContainer>
              <MyPageCategory />
            </WidgetContainer>
          </FlexItem>
          <FlexItem $flex={8}>
            <WidgetContainer>
              <MyPageGrass />
            </WidgetContainer>
          </FlexItem>
        </FlexContainer>
        <FlexContainer>
          <FlexItem $flex={1}>
            <WidgetContainer>
              <MyPageScrapNews />
            </WidgetContainer>
          </FlexItem>
        </FlexContainer>
      </MyPageContainer>
    );
  };

  return isMobile ? <MobileRender /> : <DesktopRender />;
};

export default MyPage;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const ContentWrapper = styled.main`
  flex: 1;
  overflow-y: auto;
  margin-top: 70px;
`;

const MyPageContainer = styled.div`
  padding: 0 4rem;
  margin-bottom: 5rem;

  @media (max-width: 1279px) {
    padding: 0 1rem;
  }
  @media (max-width: 767px) {
    min-height: calc(100vh - 70px);
    padding: 1.125rem;
    background-color: ${(props) => props.theme.colors.background};
  }
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  @media (max-width: 1279px) {
    flex-direction: column;
  }
`;

const FlexItem = styled.div<{ $flex: number }>`
  flex: ${(props) => props.$flex};
  margin: 1rem 0;
`;

const WidgetContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 1.75rem;
  background-color: ${(props) => props.theme.colors.cardBackground + "BF"};
  border-radius: 12px;
  transition: box-shadow 0.5s;
  backdrop-filter: blur(4px);
  box-shadow: ${(props) => props.theme.shadows.xsmall};
  box-sizing: border-box;

  @media (max-width: 767px) {
    box-shadow: none;
    border: 1px solid lightgray;
    margin: 1rem 0;
    padding: 1rem;
  }
`;

const WidgetMenuContainer = styled(WidgetContainer)`
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const MenuTitle = styled.div`
  font-weight: bold;
  font-size: 1.125rem;
`;

// modal

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// 모달이 닫힐 때의 페이드 아웃 애니메이션
const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
`;

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  height: 70px;
  background-color: ${(props) => props.theme.colors.background};
  z-index: 1000;
`;

const FullScreenModal = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 60px);
  background-color: ${(props) => props.theme.colors.background};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  animation: ${(props) => (props.$isVisible ? fadeIn : fadeOut)} 0.3s ease;
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  pointer-events: ${(props) => (props.$isVisible ? "auto" : "none")};
  transition: opacity 0.3s ease;
`;

const ModalContent = styled.div`
  padding: 1rem;
  overflow-y: auto;
  flex-grow: 1;
  height: calc(100% - 70px);
`;

const ItemTitle = styled.div`
  color: ${(props) => props.theme.colors.text03};
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1rem;
`;

const Divider = styled.hr`
  color: lightgray;
  margin: 2rem 0;
`;

const UserButton = styled.div`
  font-weight: bold;
  font-size: 1rem;
  margin: 2rem 1rem;
  cursor: pointer;
`;

// 로그아웃
const LogoutModalContent = styled.div`
  text-align: center;
  p {
    margin-bottom: 1.5rem;
    font-size: 1.25rem;
    font-weight: 500;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
`;

const ConfirmButton = styled(Button)`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  font-size: 1.125rem;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  position: sticky;
  top: 0;
  background-color: ${(props) => props.theme.colors.background};
  z-index: 1001;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
`;

const ModalTitle = styled.h2`
  margin: 0;
  margin-left: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
`;
