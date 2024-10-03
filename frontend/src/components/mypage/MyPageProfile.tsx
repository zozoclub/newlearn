import { useState, useEffect } from "react";
import styled from "styled-components";
import EditIcon from "@assets/icons/EditIcon";
import SocialNaver from "@assets/icons/SocialNaver";
import SocialKakao from "@assets/icons/SocialKakao";
import Modal from "@components/Modal";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userInfoState from "@store/userInfoState";
import { calculateExperience } from "@utils/calculateExperience";
import Avatar, { AvatarType } from "@components/common/Avatar";
import { changeNickname, changeAvatar } from "@services/mypageService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LevelIcon from "@components/common/LevelIcon";
import { checkNicknameDup } from "@services/userService";
const MyPageProfile: React.FC = () => {
  const queryClient = useQueryClient();
  const userInfo = useRecoilValue(userInfoState);
  const setUserInfo = useSetRecoilState(userInfoState);

  const [nickname, setNickname] = useState(userInfo.nickname);
  const [tempNickname, setTempNickname] = useState(userInfo.nickname);
  const [skin, setSkin] = useState(userInfo.skin);
  const [tempSkin, setTempSkin] = useState(userInfo.skin);
  const [eyes, setEyes] = useState(userInfo.eyes);
  const [tempEyes, setTempEyes] = useState(userInfo.eyes);
  const [mask, setMask] = useState(userInfo.mask);
  const [tempMask, setTempMask] = useState(userInfo.mask);
  const [isValidNickname, setIsValidNickname] = useState(true);
  const [isNicknameDuplicate, setIsNicknameDuplicate] = useState<
    boolean | null
  >(null);

  // 경험치
  const calculatedExperience = calculateExperience(userInfo.experience);
  const level = calculatedExperience.level;
  const expInCurrentLevel = calculatedExperience.expInCurrentLevel;
  const requiredExpInCurrentLevel =
    calculatedExperience.requiredExpInCurrentLevel;
  const expPercentage = calculatedExperience.percentage;

  // 유저 OAuth 정보
  const name = userInfo.name;
  const social = userInfo.provider;
  const email = userInfo.email;

  // 아바타
  const avatar: AvatarType = {
    skin: userInfo.skin,
    eyes: userInfo.eyes,
    mask: userInfo.mask,
  };

  // 저장된 유저 정보로 set
  useEffect(() => {
    setNickname(userInfo.nickname);
    setSkin(userInfo.skin);
    setEyes(userInfo.eyes);
    setMask(userInfo.mask);
  }, [userInfo]);

  // 모달 설정
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setTempNickname(nickname);
    setTempSkin(skin);
    setTempEyes(eyes);
    setTempMask(mask);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setTempNickname(tempNickname);
    setTempSkin(tempSkin);
    setTempEyes(tempEyes);
    setTempMask(tempMask);
  };

  // 닉네임 설정
  const nicknameMutation = useMutation({
    mutationFn: changeNickname,
    onSuccess: () => {
      setNickname(tempNickname);
      setUserInfo((userInfo) => ({
        ...userInfo,
        nickname: tempNickname,
      }));
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      closeModal();
    },
    onError: (error) => {
      console.error("닉네임 변경 실패:", error);
    },
  });

  // 닉네임 입력 핸들러
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value;
    setTempNickname(newNickname);
    // 기본적인 유효성 검사 (길이 및 한글 체크)
    setIsValidNickname(
      newNickname.length >= 3 &&
        newNickname.length <= 8 &&
        /^[가-힣]+$/.test(newNickname)
    );
    setIsNicknameDuplicate(null);
  };

  // 아바타 설정
  const avatarMutation = useMutation({
    mutationFn: changeAvatar,
    onSuccess: () => {
      setSkin(tempSkin);
      setEyes(tempEyes);
      setMask(tempMask);
      setUserInfo((userInfo) => ({
        ...userInfo,
        skin: tempSkin,
        eyes: tempEyes,
        mask: tempMask,
      }));
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      closeModal();
    },
    onError: (error) => {
      console.error("아바타 변경 실패:", error);
    },
  });

  // 아바타 변경 핸들러
  const handleAvatarChange = (
    part: "skin" | "eyes" | "mask",
    direction: "prev" | "next"
  ) => {
    const counts = { skin: 10, eyes: 9, mask: 14 };
    const currentValue =
      part === "skin" ? tempSkin : part === "eyes" ? tempEyes : tempMask;
    let newValue;

    if (direction === "prev") {
      newValue = currentValue > 0 ? currentValue - 1 : counts[part] - 1;
    } else {
      newValue = currentValue < counts[part] - 1 ? currentValue + 1 : 0;
    }

    if (part === "skin") setTempSkin(newValue);
    else if (part === "eyes") setTempEyes(newValue);
    else setTempMask(newValue);
  };

  // 닉네임 및 아바타 수정 저장 핸들러
  const handleSave = async () => {
    if (tempNickname !== nickname) {
      try {
        const isDuplicate = await checkNicknameDup(tempNickname);
        setIsNicknameDuplicate(isDuplicate);
        if (!isDuplicate) {
          nicknameMutation.mutate(tempNickname);
        }
      } catch (error) {
        console.error("닉네임 중복 체크 실패:", error);
        setIsNicknameDuplicate(null);
      }
    }
    if (tempSkin !== skin || tempEyes !== eyes || tempMask !== mask) {
      avatarMutation.mutate({ skin: tempSkin, eyes: tempEyes, mask: tempMask });
    }
  };

  useEffect(() => {
    const checkNickname = async () => {
      if (
        tempNickname.length < 3 ||
        !/^[가-힣ㄱ-ㅎㅏ-ㅣ]+$/.test(tempNickname)
      ) {
        setIsValidNickname(false);
        return;
      }
    };

    if (tempNickname !== nickname) {
      checkNickname();
    } else {
      setIsValidNickname(true);
    }
  }, [tempNickname, nickname]);
  return (
    <div>
      <Container>
        <AvatarContainer>
          <Avatar avatar={avatar} size={8} />
        </AvatarContainer>
        <ProfileInfoContainer>
          {/* 닉네임, 레벨 */}
          <NicknameContainer>
            <LevelContainer>
              <LevelIcon level={level} size={48} />
              {nickname}
            </LevelContainer>
            <EditIcon onClick={openModal} />
          </NicknameContainer>
          {/* 경험치 */}
          <ExperienceContainer>
            <ExperienceBarContainer>
              <ExperienceBarFill width={expPercentage} />
            </ExperienceBarContainer>
            <ExperienceText>{`${expInCurrentLevel} / ${requiredExpInCurrentLevel}`}</ExperienceText>
          </ExperienceContainer>
          {/* 소셜 로그인 정보 */}
          <SocialInfoContainer>
            {name}
            {social === "naver" ? <SocialNaver /> : <SocialKakao />}
            {email}
          </SocialInfoContainer>
        </ProfileInfoContainer>
        {/* 아바타 및 닉네임 수정 모달 */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="아바타 및 닉네임 수정"
        >
          <AvatarSettingContainer>
            <SettingContainer>
              <EyesSetting>
                <div onClick={() => handleAvatarChange("eyes", "prev")}>◀</div>
                <div onClick={() => handleAvatarChange("eyes", "next")}>▶</div>
              </EyesSetting>
              <MaskSetting>
                <div onClick={() => handleAvatarChange("mask", "prev")}>◀</div>
                <div onClick={() => handleAvatarChange("mask", "next")}>▶</div>
              </MaskSetting>
              <SkinSetting>
                <div onClick={() => handleAvatarChange("skin", "prev")}>◀</div>
                <div onClick={() => handleAvatarChange("skin", "next")}>▶</div>
              </SkinSetting>
            </SettingContainer>
            <Avatar
              avatar={{ skin: tempSkin, eyes: tempEyes, mask: tempMask }}
              size={9}
            />
          </AvatarSettingContainer>

          <NicknameEditInput
            type="text"
            value={tempNickname}
            onChange={handleNicknameChange}
          />
          <MessageContainer>
            {tempNickname !== nickname && (
              <>
                {!isValidNickname && (
                  <NicknameValidationMessage isValid={false}>
                    닉네임은 3~8자의 한글이어야 합니다.
                  </NicknameValidationMessage>
                )}
                {isNicknameDuplicate === true && (
                  <NicknameValidationMessage isValid={false}>
                    이미 사용 중인 닉네임입니다.
                  </NicknameValidationMessage>
                )}
              </>
            )}
          </MessageContainer>
          <ButtonContainer>
            <SaveButton
              onClick={handleSave}
              disabled={
                (tempNickname === nickname &&
                  tempSkin === skin &&
                  tempEyes === eyes &&
                  tempMask === mask) ||
                !isValidNickname ||
                isNicknameDuplicate === true
              }
            >
              저장
            </SaveButton>
          </ButtonContainer>
        </Modal>
      </Container>
    </div>
  );
};

export default MyPageProfile;

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
`;

const AvatarContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const ProfileInfoContainer = styled.div`
  margin: 1rem 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
`;

// 닉네임
const LevelContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NicknameContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5rem;
  font-weight: bold;
`;

const NicknameEditInput = styled.input`
  display: block;
  text-align: center;
  width: 100%;
  max-width: 200px;

  margin: 0 auto 1rem;
  padding: 0.5rem;

  color: ${(props) => props.theme.colors.text};
  background-color: ${(props) => props.theme.colors.cardBackground};
  box-sizing: border-box;
  outline: none;
  border: none;
  border-bottom: 2px solid ${(props) => props.theme.colors.text01};
  font-size: 1.25rem;
  &:focus {
    border-bottom-color: ${(props) => props.theme.colors.primary};
  }
`;

// 모달 버튼
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const CustomButton = styled.button`
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
`;

const SaveButton = styled(CustomButton)`
  color: white;
  background-color: ${(props) =>
    props.disabled ? props.theme.colors.text03 : props.theme.colors.primary};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  &:hover {
    background-color: ${(props) =>
      props.disabled
        ? props.theme.colors.text03
        : props.theme.colors.primaryPress};
  }
`;

// 경험치
const ExperienceContainer = styled.div`
  width: 90%;
  display: flex;
  gap: 1rem;
`;

const ExperienceBarContainer = styled.div`
  width: 100%;
  height: 1.25rem;
  background-color: ${(props) => props.theme.colors.cancel};
  border-radius: 5px;
  overflow: hidden;
`;

const ExperienceBarFill = styled.div<{ width: number }>`
  height: 1.25rem;
  width: ${(props) => props.width}%;
  background-color: ${(props) => props.theme.colors.primary};
  transition: width 0.5s ease-in-out;
`;

const ExperienceText = styled.div`
  font-size: 0.9rem;
  white-space: nowrap;
  margin-top: 0.25rem;
`;

// 이름, 네이버&카카오, 이메일
const SocialInfoContainer = styled.div`
  display: flex;
  font-size: 1.25rem;
  align-items: center;
  gap: 0.5rem;
`;

// 아바타
const AvatarSettingContainer = styled.div`
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

const MessageContainer = styled.div`
  height: 2.5rem; // 메시지의 최대 높이에 맞춰 조절
  display: flex;
  align-items: center;
  justify-content: center;
`;
const NicknameValidationMessage = styled.div<{ isValid: boolean }>`
  color: ${(props) =>
    props.isValid ? props.theme.colors.primary : props.theme.colors.danger};
  font-size: 1rem;
  text-align: center;
  margin-bottom: 1rem;
`;
