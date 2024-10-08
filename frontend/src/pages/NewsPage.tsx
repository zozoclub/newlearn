import styled from "styled-components";

import Recommand from "@components/NewsListPage/Recommend";
import NewsList from "@components/NewsListPage/NewsList";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Pagination from "@components/NewsListPage/Pagination";
import { useSetRecoilState } from "recoil";
import locationState from "@store/locationState";
import { useMediaQuery } from "react-responsive";
import MobileLogoHeader from "@components/common/MobileLogoHeader";

import NewsListHeader from "@components/NewsListPage/NewsListHeader";

const NewsPage = () => {
  const { category, page } = useParams();
  const selectedCategory = Number(category);
  const selectedPage = Number(page);
  const [totalPages, setTotalPages] = useState<number>(1);
  const setCurrentLocation = useSetRecoilState(locationState);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useEffect(() => {
    setCurrentLocation("newsList");

    return () => {
      setCurrentLocation("");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    padding: 0 5% 2.5%;
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

export default NewsPage;
