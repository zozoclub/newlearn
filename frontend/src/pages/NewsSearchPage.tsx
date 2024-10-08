import NewsSearch from "@components/NewsListPage/NewsSearch";
import { useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import NewsListItem from "@components/NewsListPage/NewsListItem";
import { searchNews } from "@services/searchService";
import { useQuery } from "@tanstack/react-query";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userInfoState from "@store/userInfoState";
import MyPagePagination from "@components/mypage/MyPagePagination";
import { useEffect, useState } from "react";
import WordCloud from "@components/WordCloud";
import { usePageTransition } from "@hooks/usePageTransition";
import locationState from "@store/locationState";
import { useMediaQuery } from "react-responsive";
import MobileLogoHeader from "@components/common/MobileLogoHeader";

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
  const transitionTo = usePageTransition();
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const { query } = useParams<{ query?: string }>();
  const { page } = useParams();
  const [selectedPage, setSelectedPage] = useState(Number(page) || 0);
  const userInfoData = useRecoilValue(userInfoState);
  const userDifficulty = userInfoData.difficulty;
  const [searchQuery, setSearchQuery] = useState(query || "");
  const setLocationState = useSetRecoilState(locationState);
  const elementValue = isMobile ? 6 : 5;

  useEffect(() => {
    setSearchQuery(query || "");
  }, [query]);
  const { data: searchResultData, refetch } = useQuery<SearchResponseType>({
    queryKey: ["searchNews", query, userDifficulty, selectedPage],
    queryFn: () =>
      searchNews(query || "", userDifficulty, selectedPage, elementValue),
  });

  const searchResultList = searchResultData?.searchResult || [];
  const totalPages = searchResultData?.totalPages || 0;

  // 기본 /news/search 경로일 때
  const location = useLocation();
  const isSearchPath = location.pathname === "/news/search";
  const showNoResultMessage =
    !isSearchPath && searchResultList.length === 0 && query;

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

  const handleSearch = (newQuery: string) => {
    setSearchQuery(newQuery);
    setSelectedPage(0);
    transitionTo(`/news/search/${newQuery}`);
    refetch();
  };

  useEffect(() => {
    setLocationState("search");

    return () => setLocationState("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const MobileRender = () => {
    return (
      <PageWrapper>
        <MobileLogoHeader />
        <ContentWrapper>
          <SearchBarContainer>
            <NewsSearch initialQuery={searchQuery} onSearch={handleSearch} />
          </SearchBarContainer>
          <NewsListContainer>
            {searchResultList.length > 0 ? (
              searchResultList.map((news) => (
                <NewsListItem key={news.newsId} news={news} />
              ))
            ) : showNoResultMessage ? (
              <NoResult>검색 결과가 없습니다.</NoResult>
            ) : (
              <WordCloudContainer>
                <WordCloud />
              </WordCloudContainer>
            )}
          </NewsListContainer>
          {searchResultList.length > 0 && (
            <MyPagePagination
              currentPage={selectedPage + 1} // 사용자에게 보여줄 페이지 번호
              totalPages={totalPages}
              showElement={elementValue}
              onPageChange={handlePageChange} // 페이지 변경 핸들러 전달
              onNextPage={handleNextPage} // 다음 페이지 핸들러 전달
            />
          )}
        </ContentWrapper>
      </PageWrapper>
    );
  };

  const DesktopRender = () => {
    return (
      <Container>
        <SearchBarContainer>
          <NewsSearch initialQuery={searchQuery} onSearch={handleSearch} />
        </SearchBarContainer>
        <NewsListContainer>
          {searchResultList.length > 0 ? (
            searchResultList.map((news) => (
              <NewsListItem key={news.newsId} news={news} />
            ))
          ) : showNoResultMessage ? (
            <NoResult>검색 결과가 없습니다.</NoResult>
          ) : (
            <WordCloudContainer>
              <WordCloud />
            </WordCloudContainer>
          )}
        </NewsListContainer>
        {searchResultList.length > 0 && (
          <MyPagePagination
            currentPage={selectedPage + 1} // 사용자에게 보여줄 페이지 번호
            totalPages={totalPages}
            showElement={elementValue}
            onPageChange={handlePageChange} // 페이지 변경 핸들러 전달
            onNextPage={handleNextPage} // 다음 페이지 핸들러 전달
          />
        )}
      </Container>
    );
  };

  return isMobile ? <MobileRender /> : <DesktopRender />;
};

const Container = styled.div`
  border-radius: 0.75rem;
  padding-bottom: 5rem;
`;

const SearchBarContainer = styled.div`
  padding: 0 20%;
  margin-bottom: 2rem;
  @media (max-width: 767px) {
    padding: 0 5%;
    margin-bottom: 1rem;
  }
`;

const NewsListContainer = styled.div`
  column-gap: 0.5rem;
  padding: 0 12rem;
  @media (max-width: 767px) {
    padding: 0 0.5rem;
  }
`;

const NoResult = styled.div`
  text-align: center;
  padding: 2rem 0;
  color: gray;
  font-weight: bold;
  font-size: 2rem;
`;

const WordCloudContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 2rem;
`;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
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

export default NewsSearchPage;
