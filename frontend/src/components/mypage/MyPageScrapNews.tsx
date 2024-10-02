import styled from "styled-components";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  getScrapNewsList,
  ScrapNewsResponseType,
} from "@services/mypageService";
import MyPageScrapNewsItem from "@components/mypage/MyPageScrapNewsItem";
import Spinner from "@components/Spinner";

const MyPageScrapNews = () => {
  const navigate = useNavigate();

  const [selectedDifficulty, setSelectedDifficulty] = useState(1);
  const difficultyList = [{ name: "초급" }, { name: "중급" }, { name: "고급" }];

  const { data: scrapNewsData, isLoading } = useQuery<ScrapNewsResponseType>({
    queryKey: ["scrapNewsData", selectedDifficulty],
    queryFn: () => getScrapNewsList(selectedDifficulty, 20, 0),
  });

  if (isLoading)
    <div>
      <Spinner />
    </div>;
  const scrapNewsContent = scrapNewsData ? scrapNewsData.content : [];
  const scrapNewsCount = scrapNewsData ? scrapNewsData.totalElements : 0;
  const handleGoToNews = () => {
    navigate("/news");
  };

  return (
    <div>
      <HeaderContainer>
        <ScrapNewsTitle>
          내가 스크랩한 뉴스
          <ScrapNewsCount>{scrapNewsCount}</ScrapNewsCount>
        </ScrapNewsTitle>
        <DifficultyContainer>
          {difficultyList.map((difficulty, index) => (
            <DifficultyItem
              key={difficulty.name}
              onClick={() => {
                setSelectedDifficulty(index + 1);
              }}
            >
              {difficulty.name}
            </DifficultyItem>
          ))}
          <FocusEffect $difficultyId={selectedDifficulty - 1} />
        </DifficultyContainer>
      </HeaderContainer>
      <NewsListContainer>
        {isLoading ? (
          <Spinner />
        ) : scrapNewsContent.length > 0 ? (
          scrapNewsContent.map((news) => (
            <MyPageScrapNewsItem key={news.newsId} news={news} />
          ))
        ) : (
          <NoNewsContainer>
            <NoNewsContent>스크랩한 뉴스가 없습니다.</NoNewsContent>
            <GoNewsButton onClick={handleGoToNews}>뉴스 보러가기</GoNewsButton>
          </NoNewsContainer>
        )}
      </NewsListContainer>
    </div>
  );
};

export default MyPageScrapNews;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 0 1.5rem;
  font-weight: bold;
  font-size: 1.5rem;
`;

const ScrapNewsTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ScrapNewsCount = styled.div`
  color: ${(props) => props.theme.colors.text + "AA"};
  font-size: 1.25rem;
`;

const DifficultyContainer = styled.div`
  display: flex;
  position: relative;
  width: 20%;
`;

const DifficultyItem = styled.div`
  position: relative;
  width: 33.3%;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
`;

const FocusEffect = styled.div<{ $difficultyId: number }>`
  position: absolute;
  left: ${(props) => (100 / 3) * props.$difficultyId}%;
  bottom: 0;
  transform: translate(62%, 0);
  width: 15%;
  height: 1rem;
  transition: left 0.3s;
  border-bottom: 0.175rem ${(props) => props.theme.colors.primary + "AA"};
  box-shadow: 0 0.75rem 0.25rem -0.25rem ${(props) => props.theme.colors.primary + "AA"};
`;

const NewsListContainer = styled.div`
  column-gap: 0.5rem;
  margin: 1rem 0;
`;

const NoNewsContainer = styled.div`
  text-align: center;
`;
const NoNewsContent = styled.div`
  margin: 3rem 0;
  color: gray;
  font-weight: bold;
  font-size: 2rem;
`;

const GoNewsButton = styled.button`
  padding: 1rem;
  color: white;
  background-color: ${(props) => props.theme.colors.primary};
  border: none;
  border-radius: 1rem;
  font-size: 1.25rem;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
`;
