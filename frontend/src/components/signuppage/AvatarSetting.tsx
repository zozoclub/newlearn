import { useEffect, useState } from "react";
import styled from "styled-components";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRecoilState } from "recoil";
import signupState from "@store/signupState";
import kakaoLogin from "@assets/images/kakaoButton.png";
import naverLogin from "@assets/images/naverButton.png";

const AvatarSetting = () => {
  const [signupData, setSignupData] = useRecoilState(signupState);
  const skinIndex = signupData.skin;
  const eyesIndex = signupData.eyes;
  const maskIndex = signupData.mask;
  const [skins, setSkins] = useState([
    { id: 0, url: kakaoLogin },
    { id: 1, url: naverLogin },
  ]);
  const [eyes, setEyes] = useState([
    { id: 0, url: kakaoLogin },
    { id: 1, url: naverLogin },
  ]);
  const [masks, setMasks] = useState([
    { id: 0, url: kakaoLogin },
    { id: 1, url: naverLogin },
  ]);

  // 추후에 DB에서 아이템 가져오는 것으로 수정
  async function fetchItems() {
    console.log(setSkins);
    console.log(setEyes);
    console.log(setMasks);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  const cycleSkinIndex = (direction: number) => {
    setSignupData({
      ...signupData,
      skin:
        signupData.skin + direction < 0
          ? skins.length - 1
          : (signupData.skin + direction) % skins.length,
    });
  };

  const cycleEyesIndex = (direction: number) => {
    setSignupData({
      ...signupData,
      eyes:
        signupData.eyes + direction < 0
          ? eyes.length - 1
          : (signupData.eyes + direction) % eyes.length,
    });
  };

  const cycleMaskIndex = (direction: number) => {
    setSignupData({
      ...signupData,
      mask:
        signupData.mask + direction < 0
          ? masks.length - 1
          : (signupData.mask + direction) % masks.length,
    });
  };

  return (
    <Container>
      <div className="desc">아바타 설정</div>
      <AvatarDiv>
        <Avatar>
          <Eyes $imageUrl={eyes[eyesIndex].url}></Eyes>
          <Mask $imageUrl={masks[maskIndex].url}></Mask>
          <Skin $imageUrl={skins[skinIndex].url}></Skin>
        </Avatar>
        {/* 피부 */}
        <LeftButton $top={90} onClick={() => cycleSkinIndex(-1)}>
          <ChevronLeft />
        </LeftButton>
        <RightButton $top={90} onClick={() => cycleSkinIndex(1)}>
          <ChevronRight />
        </RightButton>
        {/* 마스크 */}
        <LeftButton $top={50} onClick={() => cycleMaskIndex(-1)}>
          <ChevronLeft />
        </LeftButton>
        <RightButton $top={50} onClick={() => cycleMaskIndex(1)}>
          <ChevronRight />
        </RightButton>
        {/* 눈 */}
        <LeftButton $top={20} onClick={() => cycleEyesIndex(-1)}>
          <ChevronLeft />
        </LeftButton>
        <RightButton $top={20} onClick={() => cycleEyesIndex(1)}>
          <ChevronRight />
        </RightButton>
      </AvatarDiv>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  height: 20rem;
`;

const AvatarDiv = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, calc(-50% + 1rem));
  width: 15rem;
  height: 15rem;
`;

const Avatar = styled.div`
  width: 100%;
  height: 100%;
  /* clip-path 말고 image-mask 사용하는 것이 좋아보임 */
  clip-path: polygon(
    15% 60%,
    15% 20%,
    30% 0,
    70% 0,
    85% 20%,
    85% 60%,
    70% 75%,
    85% 80%,
    100% 100%,
    0 100%,
    15% 80%,
    30% 75%
  );
`;

const Skin = styled.div<{ $imageUrl: string }>`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.$imageUrl});
  background-size: cover;
  background-position: center;
  transition: background-image 0.3s ease-in-out;
`;

const Eyes = styled.div<{ $imageUrl: string }>`
  position: absolute;
  z-index: 2;
  width: 100%;
  height: 40%;
  background-image: url(${(props) => props.$imageUrl});
  background-size: cover;
  background-position: center;
  transition: background-image 0.3s ease-in-out;
`;

const Mask = styled.div<{ $imageUrl: string }>`
  position: absolute;
  z-index: 3;
  width: 100%;
  height: 40%;
  top: 40%;
  background-image: url(${(props) => props.$imageUrl});
  background-size: cover;
  background-position: center;
  transition: background-image 0.3s ease-in-out;
`;

const LeftButton = styled.button<{ $top: number }>`
  position: absolute;
  top: ${(props) => props.$top}%;
  left: -5rem;
  transform: translateY(-50%);
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const RightButton = styled.button<{ $top: number }>`
  position: absolute;
  top: ${(props) => props.$top}%;
  right: -5rem;
  transform: translateY(-50%);
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

export default AvatarSetting;
