import Spinner from "@components/Spinner";
import {
  getPointRankingList,
  getReadRankingList,
} from "@services/rankingService";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import styled from "styled-components";

type RankingType = {
  userId: number;
  nickname: string;
  ranking: number;
};

export type PointRankingType = RankingType & {
  experience: number;
};

export type ReadRankingType = RankingType & {
  totalNewsReadCount: number;
};

const RankingWidget = () => {
  const [selectedType, setSelectedType] = useState<"point" | "read">("point");
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

  return (
    <Container>
      <RankingKindContainer $type={selectedType}>
        <RankingKind
          $isSelected={selectedType === "point"}
          $type={"point"}
          onClick={() => setSelectedType("point")}
        >
          포인트왕
        </RankingKind>
        <RankingKind
          $isSelected={selectedType === "read"}
          $type={"read"}
          onClick={() => setSelectedType("read")}
        >
          다독왕
        </RankingKind>
      </RankingKindContainer>
      <TopRanking>
        <RankingTable>
          <thead>
            <tr>
              <th className="rank">순위</th>
              <th className="level">레벨</th>
              <th className="nickname">닉네임</th>
              <th className="count">
                {selectedType === "point" ? "포인트" : "읽은 수"}
              </th>
            </tr>
          </thead>
          <tbody>
            {selectedType === "point" ? (
              pointIsLoading ? (
                <tr>
                  <LoadingDiv>
                    <Spinner />
                  </LoadingDiv>
                </tr>
              ) : (
                <>
                  {pointRankingList?.map((pointRanking) => (
                    <tr key={pointRanking.ranking} className="rank">
                      <td>{pointRanking.ranking}</td>
                      <td>{pointRanking.experience}</td>
                      <td>{pointRanking.nickname}</td>
                      <td>{pointRanking.experience}</td>
                    </tr>
                  ))}
                </>
              )
            ) : readIsLoading ? (
              <tr>
                <LoadingDiv>
                  <Spinner />
                </LoadingDiv>
              </tr>
            ) : (
              <>
                {readRankingList?.map((readRanking) => (
                  <tr key={readRanking.ranking} className="rank">
                    <td>{readRanking.ranking}</td>
                    {/* <td>{readRanking.experience}</td> */}
                    <td>1</td> {/* 임시 레벨 */}
                    <td>{readRanking.nickname}</td>
                    <td>{readRanking.totalNewsReadCount}</td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </RankingTable>
      </TopRanking>
    </Container>
  );
};

const Container = styled.div`
  width: 90%;
  height: 90%;
  padding: 5%;
`;

const RankingKindContainer = styled.div<{ $type: "point" | "read" }>`
  position: relative;
  width: 10rem;
  height: 1rem;
  margin: auto;
  padding: 0.5rem 2rem;
  color: white;
  border-radius: 1rem;
  box-shadow: gray 0px 0px 2px 2px inset;
  background-color: white;
  cursor: pointer;
  &::after {
    content: "";
    position: absolute;
    transform: ${(props) =>
      props.$type === "point" ? "translateX(0)" : "translateX(6.5rem)"};
    transition: transform 0.5s;
    top: 0;
    left: 0;
    border-radius: 1rem;
    background-color: ${(props) => props.theme.colors.primary};
    width: 5.5rem;
    height: 1rem;
    padding: 0.5rem 1rem;
  }
`;

const RankingKind = styled.div<{
  $isSelected: boolean;
  $type: "point" | "read";
}>`
  position: absolute;
  z-index: 1;
  width: 5.5rem;
  height: 1rem;
  padding: 0.5rem 1rem;
  transform: translate(0, -50%);
  color: ${(props) => (props.$isSelected ? "white" : "black")};
  transition: color 0.5s;
  text-align: center;
  top: 50%;
  left: ${(props) => (props.$type === "point" ? 0 : "6.5rem")};
`;

const RankingTable = styled.table`
  width: 100%;
  font-size: 0.875rem;
  text-align: center;
  table-layout: fixed;
  margin-top: 1rem;
  th {
    padding-bottom: 0.4rem;
  }
  td {
    padding: 0.2rem 0;
    font-weight: 100;
  }
  .rank {
    width: 10%;
  }
  .level {
    width: 20%;
  }
  .nickname {
    width: 40%;
  }
  .count {
    width: 30%;
  }
`;

const TopRanking = styled.div``;

const LoadingDiv = styled.td`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
`;

export default RankingWidget;
