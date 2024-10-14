import styled from "styled-components";

import Recommand from "@components/NewsListPage/Recommend";
import NewsList from "@components/NewsListPage/NewsList";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Pagination from "@components/NewsListPage/Pagination";
import {
  useRecoilValue,
  // useResetRecoilState,
  useSetRecoilState,
} from "recoil";
import locationState from "@store/locationState";
import { useMediaQuery } from "react-responsive";
import MobileLogoHeader from "@components/common/MobileLogoHeader";

import NewsListHeader from "@components/NewsListPage/NewsListHeader";
import userInfoState from "@store/userInfoState";
import HybridRecommendNews from "@components/NewsListPage/HybridRecommendNews";
// import { tutorialTipState } from "@store/tutorialState";
// import {
//   completeTutorial,
//   getCompletedTutorial,
// } from "@services/tutorialService";

const NewsPage = () => {
  const { nickname } = useRecoilValue(userInfoState);
  // const setTutorialTip = useSetRecoilState(tutorialTipState);
  // const resetTutorialTip = useResetRecoilState(tutorialTipState);
  // const startTutorial = async () => {
  //   const response = await getCompletedTutorial(1);
  //   if (!response) {
  //     setTutorialTip({
  //       steps: [
  //         {
  //           selector: "#step6",
  //           content: "이 곳에서 원하는 뉴스 카테고리를 선택할 수 있습니다.",
  //         },
  //         {
  //           selector: "#step7",
  //           content: `${nickname}님에게 추천하는 뉴스를 확인할 수 있습니다.`,
  //         },
  //         {
  //           selector: "#step8",
  //           content: "선호하는 카테고리에 맞는 뉴스를 추천 받을 수 있습니다.",
  //         },
  //         {
  //           selector: "#step9",
  //           content: "상단 바에서 선택한 카테고리에 맞는 뉴스 목록입니다.",
  //         },
  //       ],
  //       isActive: true,
  //       onComplete: async () => {
  //         console.log("튜토리얼 완료!");
  //         await completeTutorial(1);
  //         resetTutorialTip();
  //       },
  //     });
  //   }
  // };

  const { category, page } = useParams();
  const selectedCategory = Number(category);
  const selectedPage = Number(page);
  const [totalPages, setTotalPages] = useState<number>(1);
  const setCurrentLocation = useSetRecoilState(locationState);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useEffect(() => {
    setCurrentLocation("newsList");
    // if (!isMobile && nickname) {
    //   startTutorial();
    // }
    return () => {
      setCurrentLocation("");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nickname]);

  const DesktopRender = () => {
    return (
      <Container>
        <NewsContent>
          {selectedCategory === 0 && <Recommand />}
          <NewsList setTotalPages={setTotalPages} />
        </NewsContent>
        <Pagination
          category={selectedCategory}
          currentPage={selectedPage}
          totalPages={totalPages}
        />
      </Container>
    );
  };

  const MobileRender = () => {
    return (
      <PageWrapper>
        <MobileLogoHeader />
        <NewsListHeader />
        <RecommandNewsContainer>
          <HybridRecommendNews />
        </RecommandNewsContainer>
        <ContentWrapper>
          <NewsContent>
            <NewsList setTotalPages={setTotalPages} />
            <Pagination
              category={selectedCategory}
              currentPage={selectedPage}
              totalPages={totalPages}
            />
          </NewsContent>
        </ContentWrapper>
      </PageWrapper>
    );
  };

  return isMobile ? <MobileRender /> : <DesktopRender />;
};

export default NewsPage;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
`;

const Container = styled.div`
  @media (min-width: 768px) {
    width: 80%;
    height: 85%;
    margin: 0 5% 10%;
    padding: 0 5% 10%;
    border-radius: 0.5rem;
  }
  @media (max-width: 767px) {
    box-sizing: border-box;
    margin: 0 0 70px;
    padding: 0;
    width: 100%;
    height: calc(100vh);
  }
`;

const NewsContent = styled.div`
  @media screen and (min-width: 768px) {
    padding: 2.5% 0;
  }

  @media screen and (max-width: 767px) {
    padding: 0 8px;
    margin-bottom: 70px;
  }
`;

const ContentWrapper = styled.main`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  @media (max-width: 767px) {
    width: 100%;
    max-width: 100%;
    height: calc(100vh-140px);
    box-sizing: border-box;
  }
`;

const RecommandNewsContainer = styled.div`
  background-color: ${(props) => props.theme.colors.cardBackground};
  padding: 1rem 0 0;
  display: flex;
  flex-direction: column;
  @media screen and (min-width: 768px) {
    gap: 2.5%;
  }
  @media screen and (max-width: 767px) {
    padding: 0 1rem;
  }
`;

const Title = styled.div`
  font-size: 1.25rem;
  padding: 0 1rem;
  font-weight: bold;
  @media screen and (min-width: 768px) {
    margin: 0.5rem 0 1rem;
  }
`;
