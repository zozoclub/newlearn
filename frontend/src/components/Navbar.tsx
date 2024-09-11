import styled from "styled-components";
import { useState } from "react";

import puzzleIcon from "@assets/icons/searchIcon.png";
import pronounceTestIcon from "@assets/icons/pronounceTestIcon.png";
import newsIcon from "@assets/icons/newsIcon.png";
import myPageIcon from "@assets/icons/myPageIcon.png";
import calendarIcon from "@assets/icons/calendarIcon.png";
import searchIcon from "@assets/icons/searchIcon.png";
import wordBookIcon from "@assets/icons/wordBookIcon.png";
import trashCanIcon from "@assets/icons/trashCanIcon.png";
import { Outlet, useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  background-color: ${(props) => props.theme.colors.cardBackground + "AA"};
  border-radius: 1rem;
  padding: 0 0.5rem;
  position: fixed;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: 1.5rem;
  box-shadow: 0.5rem 0.5rem 0.25rem ${(props) => props.theme.colors.shadow};
  transition: box-shadow 0.5s;
`;

const IconContainer = styled.div<{ $isHovered: boolean }>`
  display: inline-block;
  text-align: center;
  @media (hover: hover) and (pointer: fine) {
    transform: ${(props) =>
      props.$isHovered ? "translate(0, -1rem)" : "none"};
  }
  transition: transform 0.3s;
  transition-timing-function: ease-out;
  /* font-family: "Pretendard", sans-serif; */
  font-size: 0.8rem;
  padding: 0 0 0.5rem 0;
`;

const Icon = styled.img`
  cursor: pointer;
  margin-bottom: -0.5rem;
`;

const Navbar = () => {
  const navigate = useNavigate();
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

  const [hoveredIcon, setHoveredIcon] = useState<number | null>(null);

  function mouseEnterHandler(index: number) {
    setHoveredIcon(index);
  }

  function mouseLeaveHandler() {
    setHoveredIcon(null);
  }

  return (
    <div>
      <Container>
        {IconList.map((icon, index) => (
          <IconContainer
            key={icon.alt}
            $isHovered={hoveredIcon === index}
            onClick={() => navigate(icon.link)}
          >
            <Icon
              src={icon.src}
              alt={icon.alt}
              onMouseEnter={() => mouseEnterHandler(index)}
              onMouseLeave={mouseLeaveHandler}
            />
            <div>{icon.alt}</div>
          </IconContainer>
        ))}
      </Container>

      <Outlet />
    </div>
  );
};

export default Navbar;
