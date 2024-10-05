import styled from "styled-components";

import Recommand from "@components/newspage/Recommend";
import NewsList from "@components/newspage/NewsList";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Pagination from "@components/newspage/Pagination";
import { useSetRecoilState } from "recoil";
import locationState from "@store/locationState";

const NewsPage = () => {
  const { category, page } = useParams();
  const selectedCategory = Number(category);
  const selectedPage = Number(page);
  const [totalPages, setTotalPages] = useState<number>(1);
  const setCurrentLocation = useSetRecoilState(locationState);

  useEffect(() => {
    setCurrentLocation("newsList");

    return () => {
      setCurrentLocation("");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

const Container = styled.div`
  width: 80%;
  height: 85%;
  margin: 0 5% 10%;
  padding: 0 5% 2.5%;
  border-radius: 0.5rem;
  @media (max-width: 767px) {
    width: 95%;
    margin: 0 0 10%;
    padding: 5% 2.5% 2.5%;
  }
`;

const NewsContent = styled.div`
  padding: 2.5% 0;
`;

export default NewsPage;
