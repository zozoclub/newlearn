import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { goalDataSelector } from "@store/goalState";
import CategoryChart from "@components/CategoryChart";
import TopRankingWidget, {
  PointRankingType,
  ReadRankingType,
} from "./TopRankingWidget";
import GoalChartDoughnut from "@components/GoalChartDoughnut";
import MainGoalBar from "@components/mainpage/MainGoalBar";
import RankingWidget from "./RankingWidget";
import { useQuery } from "@tanstack/react-query";
import {
  getPointRankingList,
  getReadRankingList,
} from "@services/rankingService";

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
  const goalData = useRecoilValue(goalDataSelector);
  console.log(goalData);

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
          <GoalChartDoughnut />
          <MainGoalBar />
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
  background-color: ${(props) => props.theme.colors.cardBackground + "CC"};
  border-radius: 1rem;
  transition: box-shadow 0.5s;
  backdrop-filter: blur(4px);
  box-shadow: ${(props) => props.theme.shadows.medium};
`;

export default Widget;
