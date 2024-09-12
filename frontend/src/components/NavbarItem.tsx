import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

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
  transition-timing-function: ease-out;
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
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState<boolean>(false);

  function mouseEnterHandler(value: boolean) {
    setIsHovered(value);
  }

  function mouseLeaveHandler() {
    setTimeout(() => {
      setIsHovered(false);
    }, 100);
  }

  return (
    <Container
      key={icon.alt}
      $isHovered={isHovered}
      onClick={() => navigate(icon.link)}
      onMouseEnter={() => mouseEnterHandler(true)}
      onMouseLeave={mouseLeaveHandler}
    >
      <Icon src={icon.src} alt={icon.alt} />
      <IconDesc $isHovered={isHovered}>{icon.alt}</IconDesc>
    </Container>
  );
};

export default NavbarItem;
