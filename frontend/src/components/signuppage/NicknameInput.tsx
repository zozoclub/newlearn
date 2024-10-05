import {
  CheckAction,
  CheckActionObject,
  CheckStateType,
  SignUpAction,
  SignUpActionObject,
  SignUpStateType,
} from "types/signUpType";
import styled from "styled-components";
import { Dispatch, useEffect } from "react";

type NicknameInputProps = {
  signUpState: SignUpStateType;
  checkState: CheckStateType;
  signUpDispatch: Dispatch<SignUpActionObject>;
  checkDispatch: Dispatch<CheckActionObject>;
};

const NicknameInput: React.FC<NicknameInputProps> = ({
  signUpState,
  checkState,
  signUpDispatch,
  checkDispatch,
}) => {
  const handleNicknameChange = (newNickname: string) => {
    if (newNickname.length <= 8) {
      signUpDispatch({
        type: SignUpAction.CHANGE_NICKNAME,
        payload: newNickname,
      });
    }
  };

  useEffect(() => {
    checkDispatch({
      type: CheckAction.CHECK_NICKNAME_AVAILABLE,
      payload: signUpState.nickname, // 새 닉네임으로 검사
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signUpState.nickname]);

  return (
    <Container>
      <div className="desc">닉네임</div>
      <Input
        $isNicknameAvailable={checkState.isNicknameAvailable}
        $isNicknameDuplicated={checkState.isNicknameDuplicated}
        placeholder="닉네임 (최소 3자에서 최대 8자의 한글)"
        value={signUpState.nickname}
        onChange={(event) => handleNicknameChange(event.target.value)}
      />
      <AvailableDiv $isNicknameAvailable={checkState.isNicknameAvailable}>
        닉네임은 3~8자의 한글이어야 합니다.
      </AvailableDiv>
      <DuplicatedDiv $isNicknameDuplicated={checkState.isNicknameDuplicated}>
        중복된 닉네임입니다.
      </DuplicatedDiv>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;

const Input = styled.input<{
  $isNicknameAvailable: boolean;
  $isNicknameDuplicated: boolean;
}>`
  width: 21rem;
  height: 1.75rem;
  margin: 0 0 3rem 0;
  padding: 1rem 2rem;
  color: ${(props) => props.theme.colors.text};
  background-color: ${(props) => props.theme.colors.background + "3F"};
  border: solid 1px;
  border-color: ${(props) =>
    props.$isNicknameAvailable && !props.$isNicknameDuplicated
      ? props.theme.mode === "light"
        ? props.theme.colors.placeholder
        : "#00000000"
      : props.theme.colors.danger};
  border-radius: 0.5rem;
  &:focus {
    outline: none;
    border: solid 1px
      ${(props) =>
        props.$isNicknameAvailable && !props.$isNicknameDuplicated
          ? props.theme.colors.primary
          : props.theme.colors.dangerPress};
  }
`;

const AvailableDiv = styled.div<{ $isNicknameAvailable: boolean }>`
  position: absolute;
  top: 7rem;
  left: 0.5rem;
  color: ${(props) => props.theme.colors.danger};
  font-size: 0.75rem;
  opacity: ${(props) => (props.$isNicknameAvailable ? 0 : 1)};
  transition: opacity 0.3s;
`;

const DuplicatedDiv = styled.div<{ $isNicknameDuplicated: boolean }>`
  position: absolute;
  top: 7rem;
  left: 0.5rem;
  color: ${(props) => props.theme.colors.danger};
  font-size: 0.75rem;
  opacity: ${(props) => (props.$isNicknameDuplicated ? 1 : 0)};
  transition: opacity 0.3s;
`;

export default NicknameInput;
