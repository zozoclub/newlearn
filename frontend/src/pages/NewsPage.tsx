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
      <>
        <MobileMainHeader>
          <FullLogo height={75} width={200} />
          <img height={30} src={newsSearchIcon} />
        </MobileMainHeader>
        <NewsContent>
          {selectedCategory === 0 && <Recommand />}
          <NewsList setTotalPages={setTotalPages} />
        </NewsContent>
        <Pagination
          category={selectedCategory}
          currentPage={selectedPage}
          totalPages={totalPages}
        />
      </>
    );
  };

  return isMobile ? <MobileRender /> : <DesktopRender />;
};

const Container = styled.div`
  @media (min-width: 768px) {
    width: 80%;
    height: 85%;
    margin: 0 5% 10%;
    padding: 0 5% 2.5%;
    border-radius: 0.5rem;
  }
  @media (max-width: 767px) {
    width: 95%;
    margin: 0 0 10%;
    padding: 0 2.5% 2.5%;
  }
`;

const NewsContent = styled.div`
  @media screen and (min-width: 768px) {
    padding: 2.5% 0;
  }
`;

const MobileMainHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 75px;
  padding: 0 1.5rem 0 0;
`;
export default NewsPage;
