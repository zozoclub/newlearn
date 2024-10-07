import styled from "styled-components";
import RankingList from "./RankingList";
import TopRanking from "./TopRanking";
import RankingKindSelect from "./RankingKindSelect";

type RankingType = {
  userId: number;
  nickname: string;
  ranking: number;
};

export type PointRankingType = RankingType & {
  experience: number;
};

export type ReadRankingType = RankingType & {
  experience: number;
  totalNewsReadCount: number;
};

const RankingWidget = () => {
  return (
    <Container>
      <RankingKindSelect />
      <HorizontalLayout>
        <TopRankingWrapper>
          <TopRanking />
        </TopRankingWrapper>
        <RankingWidgetWrapper>
          <RankingList />
        </RankingWidgetWrapper>
      </HorizontalLayout>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  position: relative;
  width: 90%;
  min-height: 95%;
  height: 95%;
  padding: 2.5% 5%;
  flex-direction: column;
  align-items: center;
`;

const HorizontalLayout = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 90%;
`;

const TopRankingWrapper = styled.div`
  width: 50%; // 필요에 따라 조정
`;

const RankingWidgetWrapper = styled.div`
  width: 45%; // 필요에 따라 조정
  margin-top: 1rem;
`;

export default RankingWidget;
