import styled from "styled-components";

import Recommand from "@components/newspage/Recommend";
import NewsList from "@components/newspage/NewsList";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Pagination from "@components/newspage/Pagination";
import { useSetRecoilState } from "recoil";
import locationState from "@store/locationState";
import { useMediaQuery } from "react-responsive";

import FullLogo from "@components/common/FullLogo";
import newsSearchIcon from "@assets/icons/searchIcon.svg";
import NewsListHeader from "@components/newspage/NewsListHeader";

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
        <MobileMainHeader>
          <FullLogo height={70} width={200} />
          <img
            style={{ paddingRight: "1rem" }}
            height={30}
            src={newsSearchIcon}
          />
        </MobileMainHeader>
        <ContentWrapper>
          <NewsListHeader />
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
  }
`;

const NewsContent = styled.div`
  @media screen and (min-width: 768px) {
    padding: 2.5% 0;
  }

  @media screen and (max-width: 767px) {
    padding: 0 16px;
    margin-bottom: 70px;
  }
`;

const MobileMainHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  width: 100vw;
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
