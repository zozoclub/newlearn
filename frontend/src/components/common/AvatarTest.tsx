import styled from "styled-components";
import skinTest from "@assets/images/skinTest.gif";
import eyesTest from "@assets/images/eyesTest.gif";
import maskTest from "@assets/images/maskTest.gif";
import { useState } from "react";

const AvatarTest = () => {
  const [skinIndex, setSkinIndex] = useState<number>(0);
  const [eyesIndex, setEyesIndex] = useState<number>(0);
  const [maskIndex, setMaskIndex] = useState<number>(0);
  return (
    <>
      <div onClick={() => setSkinIndex(skinIndex > 0 ? skinIndex - 1 : 9)}>
        이전 스킨
      </div>
      <div onClick={() => setSkinIndex(skinIndex < 9 ? skinIndex + 1 : 0)}>
        다음 스킨
      </div>
      <div onClick={() => setEyesIndex(eyesIndex > 0 ? eyesIndex - 1 : 8)}>
        이전 눈
      </div>
      <div onClick={() => setEyesIndex(eyesIndex < 8 ? eyesIndex + 1 : 0)}>
        다음 눈
      </div>
      <div onClick={() => setMaskIndex(maskIndex > 0 ? maskIndex - 1 : 2)}>
        이전 마스크
      </div>
      <div onClick={() => setMaskIndex(maskIndex < 2 ? maskIndex + 1 : 0)}>
        다음 마스크
      </div>
      {skinIndex}/9
      <AvatarContainer>
        <Skin $url={skinTest} $index={skinIndex} />
        <Eyes $url={eyesTest} $index={eyesIndex} />
        <Mask $url={maskTest} $index={maskIndex} />
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
  background-size: 300% 100%;
  background-position: -${(props) => props.$index * 100}% 0%;
`;

export default AvatarTest;
