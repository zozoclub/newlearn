import NewsSearch from "@components/newspage/NewsSearch";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import NewsListItem from "@components/newspage/NewsListItem";
import { searchNews, NewsType } from "@services/newsService";
import { useQuery } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import languageState from "@store/languageState";
import userInfoState from "@store/userInfoState";
const NewsSearchPage = () => {
  const { query } = useParams<{ query?: string }>();
  const languageData = useRecoilValue(languageState);
  const { page } = useParams();
  const selectedPage = Number(page);
  const userInfoData = useRecoilValue(userInfoState);
  const userDifficulty = userInfoData.difficulty;

  const { data: searchResultList } = useQuery<NewsType[]>({
    queryKey: ["totalNewsList"],
    queryFn: () =>
      searchNews(query || "", userDifficulty, languageData, selectedPage, 10),
  });
  return (
    <Container>
      <SearchBarContainer>
        <NewsSearch initialQuery={decodeURIComponent(query || "")} />
      </SearchBarContainer>
      <NewsListContainer>
        {searchResultList?.map((news) => (
          <NewsListItem key={news.newsId} news={news} />
        ))}
      </NewsListContainer>
    </Container>
  );
};
const Container = styled.div`
  border-radius: 0.75rem;
`;

const SearchBarContainer = styled.div`
  padding: 0 20rem;
  margin-bottom: 2rem;
`;

const NewsListContainer = styled.div`
  column-gap: 0.5rem;
  padding: 0 12rem;
`;

export default NewsSearchPage;
