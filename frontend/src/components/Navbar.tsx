import styled from "styled-components";

import puzzleIcon from "@assets/icons/puzzleIcon.png";
import pronounceTestIcon from "@assets/icons/pronounceTestIcon.png";
import newsIcon from "@assets/icons/newsIcon.png";
import myPageIcon from "@assets/icons/myPageIcon.png";
import calendarIcon from "@assets/icons/calendarIcon.png";
import searchIcon from "@assets/icons/searchIcon.png";
import wordBookIcon from "@assets/icons/wordBookIcon.png";
import trashCanIcon from "@assets/icons/trashCanIcon.png";

import NavbarItem from "@components/NavbarItem";

const Container = styled.div`
  display: flex;
  background-color: ${(props) => props.theme.colors.cardBackground + "AA"};
  border-radius: 1rem;
  padding: 0 0.5rem;
  position: fixed;
  z-index: 1;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: 1.5rem;
  box-shadow: 0.5rem 0.5rem 0.25rem ${(props) => props.theme.colors.shadow};
  transition: box-shadow 0.5s;
`;

const Navbar = () => {
  const IconList = [
    { src: puzzleIcon, alt: "퍼즐", link: "/puzzle" },
    { src: pronounceTestIcon, alt: "발음 테스트", link: "/speak" },
    { src: newsIcon, alt: "뉴스", link: "/news" },
    { src: myPageIcon, alt: "마이 페이지", link: "/mypage" },
    { src: calendarIcon, alt: "달력", link: "/calendar" },
    { src: searchIcon, alt: "검색", link: "/search" },
    { src: wordBookIcon, alt: "단어장", link: "/wordbook" },
    { src: trashCanIcon, alt: "휴지통", link: "/trash" },
  ];

  return (
    <Container>
      {IconList.map((icon, index) => (
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

export default Navbar;
