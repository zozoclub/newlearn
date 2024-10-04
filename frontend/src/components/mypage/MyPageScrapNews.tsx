import styled from "styled-components";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { getScrapNewsList, ScrapNewsListType } from "@services/mypageService";
import MyPageScrapNewsItem from "@components/mypage/MyPageScrapNewsItem";
import MyPagePagination from "@components/mypage/MyPagePagination";
import Spinner from "@components/Spinner";

const MyPageScrapNews = () => {
  const navigate = useNavigate();

  const [selectedDifficulty, setSelectedDifficulty] = useState(1);
  const difficultyList = [{ name: "초급" }, { name: "중급" }, { name: "고급" }];

  const { page } = useParams();
  const [selectedPage, setSelectedPage] = useState(Number(page) || 0); // 상태로 페이지 관리

  const {
    data: scrapNewsData,
    isLoading,
    refetch,
  } = useQuery<ScrapNewsListType>({
    queryKey: ["scrapNewsData", selectedDifficulty, selectedPage],
    queryFn: () => getScrapNewsList(selectedDifficulty, selectedPage, 3),
  });

  console.log(scrapNewsData);
  if (isLoading)
    <div>
      <Spinner />
    </div>;
  const scrapNewsList = scrapNewsData?.scrapNewsList || [];
  const totalPages = scrapNewsData?.totalPages || 0;
  const totalElements = scrapNewsData?.totalElements;

  const handleGoToNews = () => {
    navigate("/news/0/1");
  };

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
    <div>
      <HeaderContainer>
        <ScrapNewsTitle>
          내가 스크랩한 뉴스
          <ScrapNewsCount>{totalElements}</ScrapNewsCount>
        </ScrapNewsTitle>
        <DifficultyContainer>
          {difficultyList.map((difficulty, index) => (
            <DifficultyItem
              key={difficulty.name}
              onClick={() => {
                setSelectedDifficulty(index + 1);
                setSelectedPage(0); // 난이도 변경 시 1페이지로 초기화
                refetch(); // 데이터 재요청
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
        ) : scrapNewsList.length > 0 ? (
          scrapNewsList.map((news) => (
            <MyPageScrapNewsItem key={news.newsId} news={news} />
          ))
        ) : (
          <NoNewsContainer>
            <NoNewsContent>스크랩한 뉴스가 없습니다.</NoNewsContent>
            <GoNewsButton onClick={handleGoToNews}>뉴스 보러가기</GoNewsButton>
          </NoNewsContainer>
        )}
      </NewsListContainer>
      {scrapNewsList.length > 0 && (
        <MyPagePagination
          currentPage={selectedPage + 1} // 사용자에게 보여줄 페이지 번호
          totalPages={totalPages}
          onPageChange={handlePageChange} // 페이지 변경 핸들러 전달
          onNextPage={handleNextPage} // 다음 페이지 핸들러 전달
        />
      )}
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
