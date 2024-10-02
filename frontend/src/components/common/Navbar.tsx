import styled from "styled-components";

import homeIcon from "@assets/icons/homeIcon.png";
import newsIcon from "@assets/icons/newsIcon.png";
import wordBookIcon from "@assets/icons/wordBookIcon.png";
import testIcon from "@assets/icons/testIcon.png";
import puzzleIcon from "@assets/icons/puzzleIcon.png";
import myPageIcon from "@assets/icons/myPageIcon.png";
import NavbarItem from "@components/common/NavbarItem";

const Navbar = () => {
  const iconList = [
    { src: homeIcon, alt: "메인 홈", link: "/" },
    { src: newsIcon, alt: "뉴스", link: "/news" },
    { src: puzzleIcon, alt: "퍼즐", link: "/puzzle" },
    { src: wordBookIcon, alt: "단어장", link: "/voca" },
    { src: testIcon, alt: "스터디", link: "/mystudy" },
    { src: myPageIcon, alt: "마이 페이지", link: "/mypage" },
  ];

  return (
    <Container>
      <ExtendArea className="extend-area">
        <div className="triangle-up"></div>
        <ExtendedBar className="extend-bar"></ExtendedBar>
      </ExtendArea>
      {iconList.map((icon, index) => (
        <NavbarItem
          key={index}
          src={icon.src}
          alt={icon.alt}
          link={icon.link}
        />
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  position: relative;
  background-color: ${(props) => props.theme.colors.cardBackground + "AA"};
  border-radius: 1rem;
  padding: 0 0.5rem;
  position: fixed;
  z-index: 1;
  left: 50%;
  transform: translate(-50%, 7rem);
  bottom: 1.5rem;
  box-shadow: ${(props) => props.theme.shadows.medium};
  transition: transform 0.5s, background-color 0.5s, box-shadow 0.5s;
  &:hover {
    transform: translate(-50%, 0);
    .extend-area,
    .extend-bar {
      transform: translate(-50%, 10rem);
    }
  }
`;

const ExtendArea = styled.div`
  position: absolute;
  width: 35vw;
  height: 7.5rem;
  top: -5rem;
  left: 50%;
  transform: translate(-50%, 0);
  transition: transform 0.75s;
  .triangle-up {
    position: absolute;
    z-index: 1;
    top: 2.5rem;
    left: 50%;
    transform: translate(-50%, 0);
    width: 0;
    height: 0;
    border-left: 0.5rem solid transparent;
    border-right: 0.5rem solid transparent;
    border-bottom: 1rem solid ${(props) => props.theme.colors.text};
  }
`;

const ExtendedBar = styled.div`
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translate(-50%, 0);
  width: 6rem;
  height: 4rem;
  border-radius: 0.5rem 0.5rem 0 0;
  background-color: ${(props) => props.theme.colors.cardBackground + "AA"};
  transition: transform 0.75s, background-color 0.5s;
`;

export default Navbar;
