import { useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { pageTransitionState } from "@store/pageTransition"; // Recoil 상태 import

const Container = styled.div<{ $isHovered: boolean }>`
  display: inline-block;
  position: relative;
  font-size: 0.8rem;
  text-align: center;
  @media (hover: hover) and (pointer: fine) {
    transform: ${(props) =>
      props.$isHovered ? "translate(0, -1rem)" : "none"};
  }
  transition: transform 0.3s;
  transition-timing-function: ease-out
  ;
  cursor: pointer;
`;

const Icon = styled.img`
  width: 75px;
  margin-bottom: -0.25rem;
`;

const IconDesc = styled.div<{ $isHovered: boolean }>`
  position: absolute;
  left: 50%;
  top: -10px;
  transform: translate(-50%, 0);
  opacity: ${(props) => (props.$isHovered ? 1 : 0)};
  transition: opacity 0.5s;
  white-space: nowrap;
`;

const NavbarItem: React.FC<{ src: string; alt: string; link: string }> = (
  icon
) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const setPageTransition = useSetRecoilState(pageTransitionState); // Recoil 상태 업데이트 함수

  function handleClick() {
    // Recoil 상태로 페이지 전환 요청
    setPageTransition({
      isTransitioning: true,
      targetLocation: icon.link,
    });
  }

  return (
    <Container
      key={icon.alt}
      $isHovered={isHovered}
      onClick={handleClick} // 클릭 시 페이지 전환 요청
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon src={icon.src} alt={icon.alt} />
      <IconDesc $isHovered={isHovered}>{icon.alt}</IconDesc>
    </Container>
  );
};

export default NavbarItem;
