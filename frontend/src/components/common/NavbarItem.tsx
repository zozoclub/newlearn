import styled from "styled-components";
import { usePageTransition } from "@hooks/usePageTransition";
import { useCallback, useRef } from "react";

const NavbarItem: React.FC<{ src: string; alt: string; link: string }> = (
  icon
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const transitionTo = usePageTransition(); // 커스텀 훅 사용

  const handleClick = () => {
    transitionTo(icon.link);
  };

  const handleMouseEnter = useCallback(() => {
    containerRef.current?.classList.add("hovered");
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTimeout(() => {
      containerRef.current?.classList.remove("hovered");
    }, 100);
  }, []);

  return (
    <Container
      ref={containerRef}
      key={icon.alt}
      onClick={handleClick} // 클릭 시 페이지 전환 요청
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Icon src={icon.src} alt={icon.alt} />
      <IconDesc className="desc">{icon.alt}</IconDesc>
    </Container>
  );
};

const Container = styled.div`
  display: inline-block;
  position: relative;
  font-size: 0.8rem;
  text-align: center;
  transition: transform 0.3s;
  transition-timing-function: ease-out;
  cursor: pointer;
  &.hovered {
    transform: translate(0, -1rem);
    .desc {
      opacity: 1;
    }
  }
`;

const Icon = styled.img`
  width: 75px;
  margin-bottom: -0.25rem;
`;

const IconDesc = styled.div`
  position: absolute;
  left: 50%;
  top: -10px;
  transform: translate(-50%, 0);
  opacity: 0;
  transition: opacity 0.5s;
  white-space: nowrap;
`;

export default NavbarItem;
