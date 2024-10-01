import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import NewsIcon from "@assets/icons/mobile/newsIcon";
import WordTestIcon from "@assets/icons/mobile/wordtestIcon";
import SpeakingTestIcon from "@assets/icons/mobile/speakingtestIcon";
import VocaIcon from "@assets/icons/mobile/vocaIcon";
import MyPageIcon from "@assets/icons/mobile/profileIcon";

const MobileNavbar = () => {
  const navigate = useNavigate();

  const iconList = [
    { Component: NewsIcon, alt: "뉴스", link: "/m" },
    { Component: WordTestIcon, alt: "단어테스트", link: "/m/wordintro" },
    { Component: SpeakingTestIcon, alt: "발음테스트", link: "/m/speakingintro" },
    { Component: VocaIcon, alt: "단어장", link: "/m/voca" },
    { Component: MyPageIcon, alt: "마이페이지", link: "/m/mypage" },
  ];

  return (
    <Container>
      {iconList.map((icon, index) => (
        <NavItem key={index} onClick={() => navigate(icon.link)}>
          <icon.Component />
          <p>{icon.alt}</p>
        </NavItem>
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: ${(props) => props.theme.colors.cardBackground};
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 4rem;
  z-index: 10;
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  p {
    font-size: 0.75rem;
    margin-top: 0.25rem;
    color: ${(props) => props.theme.colors.text};
  }
`;

export default MobileNavbar;