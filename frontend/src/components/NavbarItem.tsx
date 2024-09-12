import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div<{ $isHovered: boolean }>`
  display: inline-block;
  text-align: center;
  @media (hover: hover) and (pointer: fine) {
    transform: ${(props) =>
      props.$isHovered ? "translate(0, -1rem)" : "none"};
  }
  transition: transform 0.3s;
  transition-timing-function: ease-out;
  font-size: 0.8rem;
  padding: 0 0 0.5rem 0;
  cursor: pointer;
`;

const Icon = styled.img`
  margin-bottom: -0.5rem;
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
      <div>{icon.alt}</div>
    </Container>
  );
};

export default NavbarItem;
