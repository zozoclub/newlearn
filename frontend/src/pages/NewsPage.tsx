import styled from "styled-components";

import Recommand from "@components/newspage/Recommand";
import NewsListHeader from "@components/newspage/NewsListHeader";
import NewsList from "@components/newspage/NewsList";
import { useParams } from "react-router-dom";
import { useState } from "react";
import Pagination from "@components/newspage/Pagination";

const NewsPage = () => {
  const { category, page } = useParams();
  const selectedCategory = Number(category);
  const selectedPage = Number(page);
  const [totalPages, setTotalPages] = useState<number>(1);

  return (
    <Container>
      <NewsListHeader />
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
  padding: 2.5% 5%;
  border-radius: 0.5rem;
`;

const NewsContent = styled.div`
  padding: 2.5% 0;
`;

export default NewsPage;
