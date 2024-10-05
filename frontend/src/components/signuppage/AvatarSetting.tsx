import styled from "styled-components";
import Avatar, { AvatarType } from "@components/common/Avatar";
import {
  SignUpAction,
  SignUpActionObject,
  SignUpStateType,
} from "types/signUpType";
import { Dispatch } from "react";

type AvatarPartType = "skin" | "eyes" | "mask";
type DirectionType = "prev" | "next";

type AvatarSettingProps = {
  signUpState: SignUpStateType;
  signUpDispatch: Dispatch<SignUpActionObject>;
};

const AvatarSetting: React.FC<AvatarSettingProps> = ({
  signUpState,
  signUpDispatch,
}) => {
  const skinCount = 10;
  const eyesCount = 9;
  const maskCount = 14;
  const avatar: AvatarType = {
    skin: signUpState.skin,
    eyes: signUpState.eyes,
    mask: signUpState.mask,
  };

  const updateAvatarPart = (part: AvatarPartType, value: number) => {
    signUpDispatch({
      type: SignUpAction.CHANGE_AVATAR,
      payload: { ...avatar, [part]: value },
    });
  };

  const handleChange = (part: AvatarPartType, direction: DirectionType) => {
    const counts = { skin: skinCount, eyes: eyesCount, mask: maskCount };
    const currentValue = signUpState[part];
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
      <Avatar avatar={avatar} size={9} />
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

export default AvatarSetting;
