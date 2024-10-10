import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import NewsDetailContent from "@components/NewsDetailPage/NewsDetailContent";
import NewsDetailHeader from "@components/NewsDetailPage/NewsDetailHeader";
import ProgressBar from "@components/NewsDetailPage/ProgressBar";
import Spinner from "@components/Spinner";
import { getNewsDetail } from "@services/newsService";
import userInfoState from "@store/userInfoState";
import newsWordState from "@store/newsWordState";
import languageState from "@store/languageState";
import WordHunt from "@components/WordHunt";
import lightThumbnailImage from "@assets/images/lightThumbnail.png";
import darkThumbnailImage from "@assets/images/darkThumbnail.png";
import BackArrow from "@assets/icons/BackArrow";
import BackArrowMobileIcon from "@assets/icons/mobile/BackArrowMobileIcon";
import { DetailNewsType } from "types/newsType";
import FilteredRecommendNews from "@components/NewsDetailPage/FilteredRecommendNews";
import RecentReadNews from "@components/NewsDetailPage/RecentReadNews";
import goldMedal from "@assets/images/gold-medal.png";
import silverMedal from "@assets/images/silver-medal.png";
import bronzeMedal from "@assets/images/bronze-medal.png";
import { useMediaQuery } from "react-responsive";
import { tutorialTipState } from "@store/tutorialState";
import {
  completeTutorial,
  getCompletedTutorial,
} from "@services/tutorialService";

const NewsDetailPage = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const userInfoData = useRecoilValue(userInfoState);
  const languageData = useRecoilValue(languageState);
  const [difficulty, setDifficulty] = useState<number>(userInfoData.difficulty);
  const newsContainerRef = useRef<HTMLDivElement>(null);
  const [isReadFinished, setIsReadFinished] = useState<boolean>(false);
  const [isRead, setIsRead] = useState<boolean[] | undefined>([
    false,
    false,
    false,
  ]);
  const [isFirstView, setIsFirstView] = useState<boolean>(true);
  const { newsId } = useParams();

  console.log(newsId);

  const { isLoading: engIsLoading, data: engData } = useQuery<DetailNewsType>({
    queryKey: ["getEngNewsDetail", difficulty, Number(newsId)],
    queryFn: () => getNewsDetail(Number(newsId), difficulty, "en", isFirstView),
    staleTime: 0,
  });

  const { isLoading: korIsLoading, data: korData } = useQuery<DetailNewsType>({
    queryKey: ["getKorNewsDetail", difficulty, newsId],
    queryFn: () => getNewsDetail(Number(newsId), difficulty, "kr", isFirstView),
    staleTime: 0,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [languageData, difficulty, newsId]);

  useEffect(() => {
    setDifficulty(userInfoData.difficulty);
  }, [userInfoData.difficulty]);

  const setNewsWordState = useSetRecoilState(newsWordState);
  useEffect(() => {
    if (engData) {
      setNewsWordState(engData.words);
      setIsRead(engData.isRead);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engData]);

  const setTutorialTip = useSetRecoilState(tutorialTipState);
  const resetTutorialTip = useResetRecoilState(tutorialTipState);
  const startTutorial = async () => {
    const response = await getCompletedTutorial(2);
    if (!response) {
      setTutorialTip({
        steps: [
          {
            selector: "#step1",
<<<<<<< Updated upstream
            content: "화면 상단에 뉴스 읽음 진행도가 표시됩니다.",
=======
            content:
              "화면 상단에 뉴스 읽음 진행도가 표시됩니다. 진행도 100% 달성 시 초록색으로 나타나요.",
>>>>>>> Stashed changes
          },
          {
            selector: "#step2",
            content: "뉴스의 난이도를 조절할 수 있어요.",
          },
          {
            selector: "#step3",
            content: "읽고 있는 뉴스와 비슷한 뉴스를 추천받을 수 있어요.",
          },
          {
            selector: "#step4",
<<<<<<< Updated upstream
            content:
              "뉴스 본문에서 단어를 드래그 or 더블클릭 하면 해당 단어의 뜻을 볼 수 있고 단어를 하이라이팅 할 수 있습니다.",
=======
            content: `${userInfoData.nickname}님이 최근 읽은 뉴스를 확인할 수 있어요.`,
>>>>>>> Stashed changes
            isNeedToGo: true,
          },
          {
            selector: "#step5",
            content:
              "뉴스에서 나온 단어들을 찾는 Word Hunt 게임입니다. 단어는 가로와 세로 방향만 존재헤요.",
            isNeedToGo: true,
          },
        ],
        isActive: true,
        onComplete: async () => {
          console.log("튜토리얼 완료!");
          await completeTutorial(2);
          resetTutorialTip();
        },
      });
    }
  };

  useEffect(() => {
    if (!isMobile && userInfoData.nickname) {
      startTutorial();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsId]);

  return (
    <>
      <ProgressBar
        engIsLoading={engIsLoading}
        korIsLoading={korIsLoading}
        difficulty={difficulty}
        isFirstView={isFirstView}
        isRead={isRead}
        isReadFinished={isReadFinished}
        newsContainerRef={newsContainerRef}
        setIsFirstView={setIsFirstView}
        setIsRead={setIsRead}
        setIsReadFinished={setIsReadFinished}
      />
      <Container>
        <News>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {isMobile ? (
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  marginLeft: "0.25rem",
                  marginTop: "0.25rem",
                }}
              >
                <BackArrowMobileIcon />
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.25rem",
                  }}
                >
                  뉴스
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <BackArrow height={30} width={30} />
              </div>
            )}

            <div style={{ minHeight: "3rem" }}>
              {!engIsLoading && isRead && (
                <>
                  {isRead[2] && <Medal src={bronzeMedal} />}
                  {isRead[1] && <Medal src={silverMedal} />}
                  {isRead[0] && <Medal src={goldMedal} />}
                </>
              )}
            </div>
          </div>
          <NewsContainer ref={newsContainerRef}>
            <NewsDetailHeader
              difficulty={difficulty}
              engData={engData}
              engIsLoading={engIsLoading}
              isRead={isRead}
              korData={korData}
              korIsLoading={korIsLoading}
              setDifficulty={setDifficulty}
              setIsReadFinished={setIsReadFinished}
            />
            <ThumbnailImageDiv>
              {korIsLoading || engIsLoading ? (
                <Spinner />
              ) : engData?.thumbnailImageUrl ? (
                <ThumbnailImage src={engData?.thumbnailImageUrl} alt="" />
              ) : (
                <>
                  <ThumbnailImage src={lightThumbnailImage} />
                  <DarkThumbnailImage src={darkThumbnailImage} />
                </>
              )}
            </ThumbnailImageDiv>
            <div id="step4">
              <NewsDetailContent
                difficulty={difficulty}
                engData={engData}
                engIsLoading={engIsLoading}
                korData={korData}
                korIsLoading={korIsLoading}
                newsId={Number(newsId)}
              />
            </div>
          </NewsContainer>
          <WordHuntContainer id="step5">
            <WordHunt engData={engData?.content} />
          </WordHuntContainer>
        </News>
        <SubContainer>
          <FilteredRecommendNews />
          <RecentReadNews />
        </SubContainer>
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  gap: 2.5%;
  width: 90%;
  height: 85%;
  margin: 0 5%;
  border-radius: 0.75rem;
  overflow: hidden;
  @media (max-width: 1279px) {
    flex-direction: column;
    padding-bottom: 6rem;
  }
`;

const News = styled.div`
  position: relative;
  width: 65%;
  margin-bottom: 2.5%;
  padding: 2.5% 5%;
  border-radius: 0.75rem;
  background-color: ${(props) => props.theme.colors.cardBackground01};
  letter-spacing: 0.5px;
  word-spacing: 0.5px;
  @media (max-width: 1279px) {
    width: 90%;
  }
  @media (max-width: 767px) {
    width: 100%;
    padding: 5% 0;
    background-color: transparent;
  }
`;

const NewsContainer = styled.div``;

const ThumbnailImageDiv = styled.div`
  position: relative;
  width: 100%;
  min-height: 300px;
  background-color: ${(props) => props.theme.colors.cardBackground + "AA"};
  border-radius: 5px;
  text-align: center;
`;

const ThumbnailImage = styled.img`
  width: 75%;
  min-height: 300px;
  border-radius: 5px;
  @media screen and (max-width: 767px) {
    width: 100%;
  }
`;
const DarkThumbnailImage = styled(ThumbnailImage)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  opacity: ${(props) => (props.theme.mode === "dark" ? 1 : 0)};
  transition: opacity 0.3s;
`;

const SubContainer = styled.div`
  width: 30%;
  padding: 0 0 2% 0;
  .header {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    padding: 0.5rem;
  }
  .recommand-news {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .recent-news {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .news-div {
    display: flex;
    border-radius: 5px;
    padding: 0.5rem;
    background-color: ${(props) => props.theme.colors.newsItemBackground};
    ${(props) => (props.theme.mode === "dark" ? "#1a1a1aaa" : "#e2e2e2aa")};
    cursor: pointer;
    transform: translateY(0rem);
    transition: background-color 0.3s, transform 0.3s, border 0.3s,
      backdrop-filter 0.3s;
    &:hover {
      background-color: ${(props) =>
        props.theme.colors.newsItemBackgroundPress};
      transform: translateY(-0.25rem);
    }
  }
  .content-div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 52.5%;
    padding: 3% 1.5% 2%;
    letter-spacing: 0.03rem;
    .title {
      font-size: 1.125rem;
      line-height: 1.25rem;
      height: 3.75rem;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      @media screen and (min-width: 768px) and (max-width: 1279px) {
        font-size: 1.5rem;
        line-height: 1.75rem;
        height: 5.25rem;
      }
      @media (max-width: 767px) {
        height: 2.5rem;
        line-height: 1.25rem;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 1rem;
        margin-bottom: 3%;
      }
    }
    .category {
      @media (max-width: 767px) {
        font-size: 0.875rem;
        color: gray;
        margin-bottom: 0.25rem;
      }
    }

    @media (max-width: 767px) {
      padding: 2% 3%;
    }
  }
  .thumbnail-div {
    position: relative;
    width: 45%;
    aspect-ratio: 1.4;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 5px;
    }
  }
  @media (max-width: 1279px) {
    width: 98%;
    .content-div {
      width: 67.5%;
    }
    .thumbnail-div {
      width: 30%;
    }
  }
`;

const Medal = styled.img`
  width: 3rem;
  @media (max-width: 768px) {
    width: 1.75rem;
    height: 1.75rem;
  }
`;

const WordHuntContainer = styled.div`
  @media (max-width: 767px) {
    display: none;
  }
`;

export default NewsDetailPage;
