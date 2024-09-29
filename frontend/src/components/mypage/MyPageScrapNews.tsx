import styled from "styled-components";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getScrapNewsList, ScrapNewsType } from "@services/mypageService";
import MyPageScrapNewsItem from "@components/mypage/MyPageScrapNewsItem";

const MyPageScrapNews = () => {
  const navigate = useNavigate();

  const [selectedDifficulty, setSelectedDifficulty] = useState(1);
  const difficultyList = [{ name: "초급" }, { name: "중급" }, { name: "고급" }];

  const { data: scrapNewsData } = useQuery<ScrapNewsType[]>({
    queryKey: ["scrapNewsData", selectedDifficulty],
    queryFn: () => getScrapNewsList(selectedDifficulty, 20, 1),
  });

  const handleGoToNews = () => {
    navigate("/news");
  };

  return (
    <div>
      <HeaderContainer>
        내가 스크랩한 뉴스
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
        {scrapNewsData && scrapNewsData.length > 0 ? (
          scrapNewsData.map((news) => (
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
  font-weight: bold;
  font-size: 1.5rem;
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
`;
