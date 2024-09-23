import { useEffect, useState } from "react";
import styled from "styled-components";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRecoilState } from "recoil";
import signupState from "@store/signupState";

const AvatarSetting = () => {
  const [signupData, setSignupData] = useRecoilState(signupState);
  const skinIndex = signupData.skin;
  const eyesIndex = signupData.eyes;
  const maskIndex = signupData.mask;
  const [skins, setSkins] = useState([
    { id: 0, url: "yellow" },
    { id: 1, url: "red" },
  ]);
  const [eyes, setEyes] = useState([
    { id: 0, url: "brown" },
    { id: 1, url: "white" },
  ]);
  const [masks, setMasks] = useState([
    { id: 0, url: "black" },
    { id: 1, url: "green" },
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
      <Avatar>
        <Skin $color={skins[skinIndex].url}>
          <LeftButton $top={90} onClick={() => cycleSkinIndex(-1)}>
            <ChevronLeft />
          </LeftButton>
          <RightButton $top={90} onClick={() => cycleSkinIndex(1)}>
            <ChevronRight />
          </RightButton>
        </Skin>
        <Eyes $color={eyes[eyesIndex].url}>
          <LeftButton $top={50} onClick={() => cycleEyesIndex(-1)}>
            <ChevronLeft />
          </LeftButton>
          <RightButton $top={50} onClick={() => cycleEyesIndex(1)}>
            <ChevronRight />
          </RightButton>
        </Eyes>
        <Mask $color={masks[maskIndex].url}>
          <LeftButton $top={50} onClick={() => cycleMaskIndex(-1)}>
            <ChevronLeft />
          </LeftButton>
          <RightButton $top={50} onClick={() => cycleMaskIndex(1)}>
            <ChevronRight />
          </RightButton>
        </Mask>
      </Avatar>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  height: 20rem;
`;

const Avatar = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, calc(-50% + 1rem));
  width: 10rem;
  height: 15rem;
  background-color: blue;
`;

const Skin = styled.div<{ $color: string }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.$color};
  transition: background-color 0.3s ease-in-out;
`;

const Eyes = styled.div<{ $color: string }>`
  position: absolute;
  width: 100%;
  height: 40%;
  background-color: ${(props) => props.$color};
  transition: background-color 0.3s ease-in-out;
`;

const Mask = styled.div<{ $color: string }>`
  position: absolute;
  width: 100%;
  height: 40%;
  top: 40%;
  background-color: ${(props) => props.$color};
  transition: background-color 0.3s ease-in-out;
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
