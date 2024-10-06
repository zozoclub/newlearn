import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import MyPageProfile from "@components/mypage/MyPageProfile";
import MyPageInfo from "@components/mypage/MyPageInfo";
import MyPageCount from "@components/mypage/MyPageCount";
import MyPageCategory from "@components/mypage/MyPageCategory";
import MyPageGrass from "@components/mypage/MyPageGrass";
import MyPageScrapNews from "@components/mypage/MyPageScrapNews";

import arrowIcon from "@assets/icons/mobile/arrowIcon.svg";
import MyPageProfileMobile from "@components/mypage/mobile/MyPageProfileMobile";
import MyPageCountMobile from "@components/mypage/mobile/MyPageCountMobile";
import { useState } from "react";
import backArrowIcon from "@assets/icons/mobile/backArrowIcon.svg";
const MyPage = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isScrapNewsModalOpen, setIsScrapNewsModalOpen] = useState(false);

  const handleChartModal = () => {
    setIsChartModalOpen(true);
  };

  const handleProgressModal = () => {
    setIsProgressModalOpen(true);
  };

  const handleScrapNewsModal = () => {
    setIsScrapNewsModalOpen(true);
  };

  const MobileRender = () => {
    return (
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
          <MenuTitle>학습 현황</MenuTitle>
          <img src={arrowIcon} alt="버튼" />
        </WidgetMenuContainer>
        <WidgetMenuContainer onClick={handleScrapNewsModal}>
          <MenuTitle>내가 스크랩한 뉴스</MenuTitle>
          <img src={arrowIcon} alt="버튼" />
        </WidgetMenuContainer>
        {isChartModalOpen && (
          <FullScreenModal>
            <ModalHeader>
              <BackButton onClick={() => setIsChartModalOpen(false)}>
                <img src={backArrowIcon} alt="버튼" />
              </BackButton>
              <ModalTitle>마이 페이지</ModalTitle>
            </ModalHeader>
            <ModalContent>
              <MyPageCategory />
            </ModalContent>
          </FullScreenModal>
        )}
        {isProgressModalOpen && (
          <FullScreenModal>
            <ModalHeader>
              <BackButton onClick={() => setIsChartModalOpen(false)}>
                <img src={backArrowIcon} alt="버튼" />
              </BackButton>
              <ModalTitle>마이 페이지</ModalTitle>
            </ModalHeader>
            <ModalContent>{/* <MyPageCategory /> */}</ModalContent>
          </FullScreenModal>
        )}
        {isScrapNewsModalOpen && (
          <FullScreenModal>
            <ModalHeader>
              <BackButton onClick={() => setIsChartModalOpen(false)}>
                <img src={backArrowIcon} alt="버튼" />
              </BackButton>
              <ModalTitle>마이 페이지</ModalTitle>
            </ModalHeader>
            <ModalContent>{/* <MyPageCategory /> */}</ModalContent>
          </FullScreenModal>
        )}
      </MyPageContainer>
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

const MyPageContainer = styled.div`
  padding: 0 4rem;
  margin-bottom: 5rem;

  @media (max-width: 1279px) {
    padding: 0 1rem;
  }
  @media (max-width: 767px) {
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

  @media (max-width: 768px) {
    box-shadow: none;
    border: 1px solid lightgray;
    margin: 1rem 0;
    padding: 1rem;
  }
`;

const WidgetMenuContainer = styled(WidgetContainer)`
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MenuTitle = styled.div`
  font-weight: bold;
  font-size: 1.5rem;
`;

// modal

const FullScreenModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 0%;
  background-color: ${(props) => props.theme.colors.background};
  z-index: 1000;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
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

const ModalContent = styled.div`
  padding: 1rem;
`;
