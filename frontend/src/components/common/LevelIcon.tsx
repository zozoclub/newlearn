import React from "react";
import styled from "styled-components";
import levelIconsImage from "@assets/images/levelIcon.svg";

interface LevelIconProps {
  level: number;
  size?: number;
}

const LevelIcon: React.FC<LevelIconProps> = ({ level, size = 48 }) => {
  const adjustedLevel = Math.min(Math.max(level - 1, 0), 99);
  const row = Math.floor(adjustedLevel / 10);
  const col = adjustedLevel % 10;

  return (
    <IconWrapper size={size}>
      <IconImage $row={row} $col={col} />
    </IconWrapper>
  );
};
const IconWrapper = styled.div<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  overflow: hidden;
`;

const IconImage = styled.div<{ $row: number; $col: number }>`
  width: 100%;
  height: 100%;
  background-image: url(${levelIconsImage});
  background-size: 1000% 1000%;
  background-position: ${(props) =>
    `${props.$col * 11.11}% ${props.$row * 11.11}%`};
  image-rendering: pixelated;
`;

export default LevelIcon;
