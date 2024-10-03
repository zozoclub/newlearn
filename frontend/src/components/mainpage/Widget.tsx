import styled from "styled-components";
import CategoryChart from "@components/CategoryChart";
import TopRankingWidget, {
  PointRankingType,
  ReadRankingType,
} from "./TopRankingWidget";
import GoalChartDoughnut from "@components/GoalChartDoughnut";
import MainGoalBar from "@components/mainpage/MainGoalBar";
import { useNavigate } from "react-router-dom";
import RankingWidget from "./RankingWidget";
import { useQuery } from "@tanstack/react-query";
import {
  getPointRankingList,
  getReadRankingList,
} from "@services/rankingService";
import { useRecoilValue } from "recoil";
import { goalDataSelector } from "@store/goalState";

const Widget: React.FC<{ variety: string }> = ({ variety }) => {
  const { isLoading: pointIsLoading, data: pointRankingList } = useQuery<
    PointRankingType[]
  >({
    queryKey: ["pointRankingData"],
    queryFn: getPointRankingList,
  });
  const { isLoading: readIsLoading, data: readRankingList } = useQuery<
    ReadRankingType[]
  >({
    queryKey: ["readRankingList"],
    queryFn: getReadRankingList,
  });
  const navigate = useNavigate();
  const goalData = useRecoilValue(goalDataSelector);
  const handleMyStudy = () => {
    navigate("/mystudy");
  };
  switch (variety) {
    case "profile":
      return <WidgetContainer></WidgetContainer>;
    case "chart":
      return (
        <WidgetContainer className="chart">
          <CategoryChart />
        </WidgetContainer>
      );
    case "topRanking":
      return (
        <WidgetContainer>
          <TopRankingWidget
            pointIsLoading={pointIsLoading}
            pointRankingList={pointRankingList}
            readIsLoading={readIsLoading}
            readRankingList={readRankingList}
          />
        </WidgetContainer>
      );
    case "ranking":
      return (
        <WidgetContainer>
          <RankingWidget
            pointIsLoading={pointIsLoading}
            pointRankingList={pointRankingList}
            readIsLoading={readIsLoading}
            readRankingList={readRankingList}
          />
        </WidgetContainer>
      );
    case "goal":
      return (
        <WidgetContainer>
          {goalData[0].goal && goalData[1].goal && goalData[2].goal ? (
            <>
              <GoalChartDoughnut />
              <MainGoalBar />
            </>
          ) : (
            <>
              <div>아직 학습 목표가 없습니다.</div>
              <GoalSetting onClick={handleMyStudy}>
                학습 목표 설정하기
              </GoalSetting>
            </>
          )}
        </WidgetContainer>
      );
  }
};

const WidgetContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 95%;
  padding: 2.5%;

  aspect-ratio: 1;
  background-color: ${(props) => props.theme.colors.cardBackground01};
  border-radius: 1rem;
  transition: box-shadow 0.5s;
  backdrop-filter: blur(12px);
  box-shadow: ${(props) => props.theme.shadows.medium};
`;

const GoalSetting = styled.button`
  padding: 0.75rem;
  margin-top: 1rem;
  border: none;
  border-radius: 5px;
  color: white;
  background-color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
`;
export default Widget;
