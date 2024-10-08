import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import NewsIcon from "@assets/icons/mobile/newsIcon";
import StudyIcon from "@assets/icons/mobile/studyIcon";
import VocaIcon from "@assets/icons/mobile/vocaIcon";
import MyPageIcon from "@assets/icons/mobile/profileIcon";
import HomeIcon from "@assets/icons/mobile/homeIcon";
const MobileNavbar = () => {
  const navigate = useNavigate();

  const iconList = [
    { Component: HomeIcon, alt: "홈", link: "/" },
    { Component: NewsIcon, alt: "뉴스", link: "/news/0/1" },
    { Component: VocaIcon, alt: "단어장", link: "/voca" },
    { Component: StudyIcon, alt: "스터디", link: "/mystudy" },
    { Component: MyPageIcon, alt: "마이페이지", link: "/mypage" },
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
  left: 0;
  bottom: 0;
  width: 100%;
  height: 4rem;
  z-index: 10;
  box-shadow: 0 0 0.25rem #0000004f;
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
