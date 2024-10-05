import NewsSearch from "@components/newspage/NewsSearch";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import NewsListItem from "@components/newspage/NewsListItem";
import { searchNews } from "@services/newsService";
import { useQuery } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import userInfoState from "@store/userInfoState";
import MyPagePagination from "@components/mypage/MyPagePagination";
import { useState } from "react";

type SearchNewsType = {
  newsId: number;
  title: string;
  content: string;
  thumbnailImageUrl: string;
  category: string;
  publishedDate: string;
  isRead: boolean[];
  scrapedDate: string;
};

type SearchResponseType = {
  searchResult: SearchNewsType[];
  totalPages: number;
};

const NewsSearchPage = () => {
  const { query } = useParams<{ query?: string }>();
  const { page } = useParams();
  const [selectedPage, setSelectedPage] = useState(Number(page) || 0);
  const userInfoData = useRecoilValue(userInfoState);
  const userDifficulty = userInfoData.difficulty;

  const { data: searchResultData, refetch } = useQuery<SearchResponseType>({
    queryKey: ["searchNews", query, userDifficulty, selectedPage],
    queryFn: () => searchNews(query || "", userDifficulty, selectedPage, 5),
  });

  const searchResultList = searchResultData?.searchResult || [];
  const totalPages = searchResultData?.totalPages || 0;

  console.log(searchResultList);
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return; // 유효한 페이지인지 확인
    setSelectedPage(newPage - 1); // 상태 업데이트, 0부터 시작하는 값으로 조정
    refetch(); // 데이터 재요청
  };

  const handleNextPage = () => {
    if (selectedPage + 1 < totalPages) {
      setSelectedPage((prevPage) => prevPage + 1); // 다음 페이지로 이동
      refetch(); // 데이터 재요청
    }
  };

  return (
    <Container>
      <SearchBarContainer>
        <NewsSearch initialQuery={decodeURIComponent(query || "")} />
      </SearchBarContainer>
      <NewsListContainer>
        {searchResultList.length > 0 ? (
          searchResultList.map((news) => (
            <NewsListItem key={news.newsId} news={news} />
          ))
        ) : (
          <NoResult>검색 결과가 없습니다.</NoResult>
        )}
      </NewsListContainer>
      {searchResultList.length > 0 && (
        <MyPagePagination
          currentPage={selectedPage + 1} // 사용자에게 보여줄 페이지 번호
          totalPages={totalPages}
          showElement={5}
          onPageChange={handlePageChange} // 페이지 변경 핸들러 전달
          onNextPage={handleNextPage} // 다음 페이지 핸들러 전달
        />
      )}
    </Container>
  );
};
const Container = styled.div`
  border-radius: 0.75rem;
  padding-bottom: 5rem;
`;

const SearchBarContainer = styled.div`
  padding: 0 20rem;
  margin-bottom: 2rem;
`;

const NewsListContainer = styled.div`
  column-gap: 0.5rem;
  padding: 0 12rem;
`;

const NoResult = styled.div`
  text-align: center;
  padding: 2rem 0;
  color: gray;
  font-weight: bold;
  font-size: 2rem;
`;
export default NewsSearchPage;
