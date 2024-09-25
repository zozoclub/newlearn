import styled from "styled-components";
import skinTest from "@assets/images/skinTest.gif";
import { useState } from "react";

const AvatarTest = () => {
  const [skinIndex, setSkinIndex] = useState<number>(0);
  return (
    <>
      <div onClick={() => setSkinIndex(skinIndex > 0 ? skinIndex - 1 : 9)}>
        이전 스킨
      </div>
      <div onClick={() => setSkinIndex(skinIndex < 9 ? skinIndex + 1 : 0)}>
        다음 스킨
      </div>
      {skinIndex}/9
      <AvatarContainer>
        <Skin $url={skinTest} $index={skinIndex} />
      </AvatarContainer>
    </>
  );
};

const AvatarContainer = styled.div`
  position: relative;
  width: 96px;
  height: 96px;
`;

const Skin = styled.div<{ $url: string; $index: number }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.$url});
  background-size: 1000% 100%;
  background-position: -${(props) => props.$index * 100}% 0%;
`;

export default AvatarTest;
