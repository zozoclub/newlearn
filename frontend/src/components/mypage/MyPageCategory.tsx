import React from "react";
import styled from "styled-components";
import CategoryChart from "@components/CategoryChart";

type CountDataKey =
  | "economyCount"
  | "politicsCount"
  | "societyCount"
  | "cultureCount"
  | "scienceCount"
  | "globalCount";

type CountData = {
  [K in CountDataKey]: number;
};

const getLabelFromKey = (key: CountDataKey): string => {
  const labelMap: Record<typeof key, string> = {
    economyCount: "경제",
    politicsCount: "정치",
    societyCount: "사회",
    cultureCount: "생활/문화",
    scienceCount: "IT/과학",
    globalCount: "세계",
  };
  return labelMap[key] || key;
};

const MyPageCategory: React.FC = () => {
  // 임시 데이터
  const countData: CountData = {
    economyCount: 7,
    politicsCount: 12,
    societyCount: 4,
    cultureCount: 16,
    scienceCount: 3,
    globalCount: 7,
  };

  const countSum = Object.values(countData).reduce(
    (sum, count) => sum + count,
    0
  );
  return (
    <Container>
      <ChartContainer>
        <CategoryChart countData={countData} />
      </ChartContainer>
      <DataContainer>
        <DataHeader>
          <HeaderItem>카테고리</HeaderItem>
          <HeaderItem>읽은 수</HeaderItem>
          <HeaderItem>퍼센트</HeaderItem>
        </DataHeader>
        {(Object.entries(countData) as [CountDataKey, number][]).map(
          ([key, value], index, array) => (
            <>
              <DataRow>
                <DataLabel>{getLabelFromKey(key)}</DataLabel>
                <DataValueContainer>
                  <DataValue>{value}</DataValue>
                  <DataPercentage>{`${((value / countSum) * 100).toFixed(
                    2
                  )}%`}</DataPercentage>
                </DataValueContainer>
              </DataRow>
              {index < array.length - 1 && <Divider />}
            </>
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
`;

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin-left: 1rem;
`;

const DataContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  margin-right: 2rem;
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
  text-align: right;
  &:first-child {
    text-align: left;
  }
  &:last-child {
    text-align: right;
  }
`;

const DataRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.25rem;
`;

const DataLabel = styled.div`
  flex: 1;
  margin: 0 0.5rem;
  font-size: 1.125rem;
`;

const DataValueContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`;

const DataValue = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  text-align: right;
  width: 4ch;
  margin-right: 2rem;
`;

const DataPercentage = styled.div`
  width: 7ch;
  margin: 0 0.5rem;
  text-align: right;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${(props) => props.theme.colors.placeholder}66;
  margin: 0.5rem 0;
`;
