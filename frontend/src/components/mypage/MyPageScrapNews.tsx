import styled from "styled-components";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getScrapNewsList, ScrapNewsType } from "@services/mypageService";
import MyPageScrapNewsItem from "@components/mypage/MyPageScrapNewsItem";

const MyPageScrapNews = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState(0);
  const difficultyList = [{ name: "초급" }, { name: "중급" }, { name: "고급" }];

  const { data: scrapNewsData } = useQuery<ScrapNewsType[]>({
    queryKey: ["scrapNewsData", selectedDifficulty],
    queryFn: () => getScrapNewsList(selectedDifficulty, 20, 1),
  });

  return (
    <div>
      <HeaderContainer>
        내가 스크랩한 뉴스
        <DifficultyContainer>
          {difficultyList.map((difficulty, index) => (
            <DifficultyItem
              key={difficulty.name}
              onClick={() => {
                setSelectedDifficulty(index);
              }}
            >
              {difficulty.name}
            </DifficultyItem>
          ))}
          <FocusEffect $difficultyId={selectedDifficulty} />
        </DifficultyContainer>
      </HeaderContainer>
      <NewsListContainer>
        {scrapNewsData && scrapNewsData.length > 0 ? (
          scrapNewsData.map((news) => (
            <MyPageScrapNewsItem key={news.newsId} news={news} />
          ))
        ) : (
          <NoNewsContent>스크랩한 뉴스가 없습니다.</NoNewsContent>
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

const NoNewsContent = styled.div`
  text-align: center;
  margin: 2rem 0;
  color: gray;
  font-weight: bold;
  font-size: 2rem;
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
