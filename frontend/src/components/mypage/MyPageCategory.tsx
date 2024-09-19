import React from "react";
import styled from "styled-components";
import CategoryChart from "@components/CategoryChart";

type CountDataKey =
  | "economyCount"
  | "politicsCount"
  | "societyCount"
  | "cultureCount"
  | "scienceCount"
  | "entertainCount";

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
    entertainCount: "연예",
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
    entertainCount: 7,
  };

  return (
    <Container>
      <ChartContainer>
        <CategoryChart countData={countData} height={300} />
      </ChartContainer>
      <DataContainer>
        {(Object.entries(countData) as [CountDataKey, number][]).map(
          ([key, value]) => (
            <DataRow key={key}>
              <DataLabel>{getLabelFromKey(key)}</DataLabel>
              <DataValue>{value}</DataValue>
            </DataRow>
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
  width: 50%;
`;

const DataContainer = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
`;

const DataRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DataLabel = styled.div`
  margin: 0.75rem 1.5rem;
  font-size: 1.25rem;
`;

const DataValue = styled.div`
  margin: 0.75rem 3rem;
  font-size: 1.25rem;
  font-weight: bold;
`;
