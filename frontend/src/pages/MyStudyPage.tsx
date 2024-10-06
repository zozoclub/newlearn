import styled from "styled-components";
import { useEffect } from "react";
import Goal from "@components/mystudypage/Goal";
import locationState from "@store/locationState";
import { useSetRecoilState } from "recoil";

import testMenuBg from "@assets/images/background-speakingtest.png";
import vocaMenuBg from "@assets/images/background-vocamenu.png";

import { usePageTransition } from "@hooks/usePageTransition";

const MyStudyPage = () => {
  const transitionTo = usePageTransition();

  // 페이지 헤더
  const setCurrentLocation = useSetRecoilState(locationState);
  useEffect(() => {
    setCurrentLocation("My Study");
  }, [setCurrentLocation]);

  // 페이지 이동
  const handleWordClick = () => {
    transitionTo("/wordtesthistory");
  };

  const handleSpeakingClick = () => {
    transitionTo("/speakingtesthistory");
  };

  return (
    <Container>
      <Goal />

      <MenuContainer>
        <VocaMenu onClick={handleWordClick}>
          <Overlay>
            <MenuTitle>Word Test</MenuTitle>
            <MenuDescription>저장한 단어 테스트</MenuDescription>
          </Overlay>
        </VocaMenu>
        <WordMenu onClick={handleSpeakingClick}>
          <Overlay>
            <MenuTitle>Pronounce Test</MenuTitle>
            <MenuDescription>발음 테스트 및 분석</MenuDescription>
          </Overlay>
        </WordMenu>
      </MenuContainer>
    </Container>
  );
};

export default MyStudyPage;

const Container = styled.div`
  display: flex;
  gap: 3rem;
  width: 90%;
  padding: 50px 5%;
  min-height: 600px;
  height: 600px;
`;

const MenuContainer = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 2.75rem;
`;

const MenuItemBase = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;

  width: 100%;
  height: 100%;
  padding: 1.75rem;

  color: white;
  backdrop-filter: blur(4px);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: ${(props) => props.theme.shadows.medium};
  box-sizing: border-box;

  border-radius: 12px;

  font-size: 1.5rem;
  font-weight: bold;

  transition: all 0.5s ease;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  cursor: pointer;

  &:hover {
    transform: scale(1.01);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: inherit;
    filter: grayscale(100%);
    transition: all 0.5s ease;
  }

  &:hover::before {
    filter: grayscale(0%);
    transform: scale();
  }
`;

const Overlay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;

  width: 100%;
  height: 100%;
  padding: 0 3rem;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0) 100%
  );
  box-sizing: border-box;
`;

const MenuTitle = styled.h2`
  margin: 0.5rem 0;
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const MenuDescription = styled.div`
  margin: 0.5rem 0;
  font-size: 1.25rem;
`;
const VocaMenu = styled(MenuItemBase)`
  background-image: url(${vocaMenuBg});
`;

const WordMenu = styled(MenuItemBase)`
  background-image: url(${testMenuBg});
`;
