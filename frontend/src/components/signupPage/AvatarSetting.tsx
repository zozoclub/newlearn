import styled from "styled-components";
import { useRecoilState } from "recoil";

import skinTest from "@assets/images/skinTest.gif";
import eyesTest from "@assets/images/eyesTest.gif";
import maskTest from "@assets/images/maskTest.gif";
import signupState from "@store/signupState";

type AvatarPartType = "skin" | "eyes" | "mask";
type DirectionType = "prev" | "next";

const AvatarSetting = () => {
  const skinCount = 10;
  const eyesCount = 9;
  const maskCount = 14;
  const [signupData, setSignupData] = useRecoilState(signupState);
  const { skin, eyes, mask } = signupData;

  const updateAvatarPart = (part: AvatarPartType, value: number) => {
    setSignupData((prev) => ({
      ...prev,
      [part]: value,
    }));
  };

  const handleChange = (part: AvatarPartType, direction: DirectionType) => {
    const counts = { skin: skinCount, eyes: eyesCount, mask: maskCount };
    const currentValue = signupData[part];
    let newValue;

    if (direction === "prev") {
      newValue = currentValue > 0 ? currentValue - 1 : counts[part] - 1;
    } else {
      newValue = currentValue < counts[part] - 1 ? currentValue + 1 : 0;
    }

    updateAvatarPart(part, newValue);
  };

  return (
    <Container>
      <SettingContainer>
        <EyesSetting>
          <div onClick={() => handleChange("eyes", "prev")}>◀</div>
          <div onClick={() => handleChange("eyes", "next")}>▶</div>
        </EyesSetting>
        <MaskSetting>
          <div onClick={() => handleChange("mask", "prev")}>◀</div>
          <div onClick={() => handleChange("mask", "next")}>▶</div>
        </MaskSetting>
        <SkinSetting>
          <div onClick={() => handleChange("skin", "prev")}>◀</div>
          <div onClick={() => handleChange("skin", "next")}>▶</div>
        </SkinSetting>
      </SettingContainer>
      <AvatarContainer>
        <Skin $url={skinTest} $index={skin} />
        <Eyes $url={eyesTest} $index={eyes} />
        <Mask $url={maskTest} $index={mask} />
      </AvatarContainer>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 15rem;
`;

const SettingContainer = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 75%;
  height: 100%;
`;

const SettingDiv = styled.div`
  display: flex;
  justify-content: space-between;
  position: absolute;
  width: 100%;
  * {
    cursor: pointer;
  }
`;

const EyesSetting = styled(SettingDiv)`
  top: 25%;
`;

const MaskSetting = styled(SettingDiv)`
  top: 50%;
`;

const SkinSetting = styled(SettingDiv)`
  top: 75%;
`;

const AvatarContainer = styled.div`
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  width: 9rem;
  height: 9rem;
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

export default AvatarSetting;
