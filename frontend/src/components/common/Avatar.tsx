import styled from "styled-components";

import skinTest from "@assets/images/skinTest.gif";
import eyesTest from "@assets/images/eyesTest.gif";
import maskTest from "@assets/images/maskTest.gif";

export type AvatarType = {
  skin: number;
  eyes: number;
  mask: number;
};

type AvatarProps = {
  avatar: AvatarType;
  size: number;
};

const Avatar: React.FC<AvatarProps> = ({ avatar, size }) => {
  const { skin, eyes, mask } = avatar;

  return (
    <AvatarContainer $size={size}>
      <Skin $url={skinTest} $index={skin} />
      <Eyes $url={eyesTest} $index={eyes} />
      <Mask $url={maskTest} $index={mask} />
    </AvatarContainer>
  );
};

const AvatarContainer = styled.div<{ $size: number }>`
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  width: ${(props) => props.$size}rem;
  height: ${(props) => props.$size}rem;
  margin: auto;
`;

const Skin = styled.div<{ $url: string; $index: number }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.$url});
  background-size: 1000% 100%;
  background-position: -${(props) => props.$index * 100}% 0%;
`;

const Eyes = styled.div<{ $url: string; $index: number }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.$url});
  background-size: 900% 100%;
  background-position: -${(props) => props.$index * 100}% 0%;
`;

const Mask = styled.div<{ $url: string; $index: number }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.$url});
  background-size: 1000% 200%;
  background-position: -${(props) => (props.$index % 10) * 100}% -${(props) =>
      Math.floor(props.$index / 10) * 100}%;
`;

export default Avatar;
