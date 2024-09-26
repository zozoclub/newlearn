import styled from "styled-components";
import MyPageProfile from "@components/myPage/MyPageProfile";
import MyPageInfo from "@components/myPage/MyPageInfo";
import MyPageCount from "@components/myPage/MyPageCount";
import MyPageCategory from "@components/myPage/MyPageCategory";
import MyPageGrass from "@components/myPage/MyPageGrass";
import MyPageScrapNews from "@components/myPage/MyPageScrapNews";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import locationState from "@store/locationState";

const MyPage = () => {
  const setCurrentLocation = useSetRecoilState(locationState);

  useEffect(() => {
    setCurrentLocation("My Page");
    return () => {
      setCurrentLocation("");
    };
  }, [setCurrentLocation]);

  return (
    <div>
      <MyPageContainer>
        <FlexContainer>
          <FlexItem $flex={3}>
            <WidgetContainer>
              <MyPageProfile />
            </WidgetContainer>
          </FlexItem>
          <FlexItem $flex={2}>
            <WidgetContainer>
              <MyPageInfo />
            </WidgetContainer>
          </FlexItem>
          <FlexItem $flex={2}>
            <WidgetContainer>
              <MyPageCount />
            </WidgetContainer>
          </FlexItem>
        </FlexContainer>
        <FlexContainer>
          <FlexItem $flex={7}>
            <WidgetContainer>
              <MyPageCategory />
            </WidgetContainer>
          </FlexItem>
          <FlexItem $flex={8}>
            <WidgetContainer>
              <MyPageGrass />
            </WidgetContainer>
          </FlexItem>
        </FlexContainer>
        <FlexContainer>
          <FlexItem $flex={1}>
            <WidgetContainer>
              <MyPageScrapNews />
            </WidgetContainer>
          </FlexItem>
        </FlexContainer>
      </MyPageContainer>
    </div>
  );
};

export default MyPage;

const MyPageContainer = styled.div`
  padding: 0 4rem;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
`;

const FlexItem = styled.div<{ $flex: number }>`
  flex: ${(props) => props.$flex};
  margin: 1rem 0;
`;

const WidgetContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 1.75rem;
  background-color: ${(props) => props.theme.colors.cardBackground + "BF"};
  border-radius: 12px;
  transition: box-shadow 0.5s;
  backdrop-filter: blur(4px);
  box-shadow: 0.25rem 0.25rem 0.25rem ${(props) => props.theme.colors.shadow};
  box-sizing: border-box;
`;
