import React from "react";
import styled from "styled-components";
import CategoryChart from "@components/CategoryChart";
import { getLabelFromKey, getUserChart } from "@services/mypageService";
import { CategoryCountKey, CategoryCountType } from "@services/mypageService";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@components/Spinner";

const MyPageCategory: React.FC = () => {
  // 카테고리 별 읽은 수 가져오기
  const { data: countData } = useQuery<CategoryCountType | null>({
    queryKey: ["categoryCountData"],
    queryFn: getUserChart,
  });

  if (!countData) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  // 퍼센트 계산을 위한 합계 계산
  const countSum = Object.values(countData).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <Container>
      <ChartContainer>
        <CategoryChart />
      </ChartContainer>
      <DataContainer>
        <DataHeader>
          <HeaderItem>카테고리</HeaderItem>
          <HeaderItem>읽은 수</HeaderItem>
          <HeaderItem>퍼센트</HeaderItem>
        </DataHeader>
        {(Object.entries(countData) as [CategoryCountKey, number][]).map(
          ([key, value], index, array) => (
            <div key={key}>
              <DataRow>
                <DataLabel>{getLabelFromKey(key)}</DataLabel>
                <DataValue>{value}</DataValue>
                <DataPercentage>
                  {countSum > 0
                    ? `${((value / countSum) * 100).toFixed(2)}%`
                    : "0%"}
                </DataPercentage>
              </DataRow>
              {index < array.length - 1 && <Divider />}
            </div>
          )
        )}
      </DataContainer>
    </Container>
  );
};

export default MyPageCategory;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 3rem;
  }
`;

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin-left: 1rem;
  letter-spacing: 0.03rem;
  @media (max-width: 768px) {
    width: 90%;
    align-items: center;
    margin: 0;
  }
`;

const DataContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  margin-right: 2rem;
  @media (max-width: 768px) {
    width: 90%;
    margin: 0 1rem;
    margin-bottom: 1rem;
  }
`;

const DataHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${(props) => props.theme.colors.text04}66;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const HeaderItem = styled.div`
  flex: 1;
  margin: 0 0.875rem;
  text-align: center;
`;

const DataRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.25rem 0;
`;

const DataLabel = styled.div`
  flex: 1;
  font-size: 1.125rem;
  text-align: center;
`;

const DataValue = styled.div`
  flex: 1;
  font-size: 1.25rem;
  font-weight: bold;
  text-align: center;
`;

const DataPercentage = styled.div`
  flex: 1;
  text-align: center;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${(props) => props.theme.colors.placeholder}66;
  margin: 0.5rem 0;
`;
