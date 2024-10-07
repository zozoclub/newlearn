import React from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import userInfoState from "@store/userInfoState";

const MyPageCountMobile = () => {
  const userInfo = useRecoilValue(userInfoState);

  const readCount = userInfo.totalNewsReadCount;
  const vocaCount = userInfo.unCompleteWordCount + userInfo.completeWordCount;
  const scrapCount = userInfo.scrapCount;

  const items = [
    { title: "읽은 기사", count: readCount },
    { title: "저장한 단어", count: vocaCount },
    { title: "스크랩 기사", count: scrapCount },
  ];
  return (
    <Container>
      {items.map((item, index) => (
        <React.Fragment key={item.title}>
          <ItemContainer>
            <TitleContainer>
              <div key={item.title}>{item.title}</div>
            </TitleContainer>
            <ContentContainer>
              <div key={item.title}>{item.count}</div>
            </ContentContainer>
          </ItemContainer>
          {index < items.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </Container>
  );
};

export default MyPageCountMobile;

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1.5rem;
  justify-content: space-between;
`;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const TitleContainer = styled.div`
  display: flex;
  flex: 3;
  gap: 2rem;
  font-size: 1rem;
  font-weight: bold;
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  gap: 2rem;
  font-size: 1.125rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
`;

const Divider = styled.div`
  height: 2.5rem;
  width: 1px;
  background-color: lightgray;
  margin: 0 0.5rem;
`;
