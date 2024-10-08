import styled from "styled-components";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  checkState,
  nicknameDupState,
  nicknameState,
} from "@store/signUpState";

const NicknameInput = () => {
  const [nicknameValue, setNicknameState] = useRecoilState(nicknameState);
  const checkValue = useRecoilValue(checkState);
  const handleNicknameChange = (newNickname: string) => {
    if (newNickname.length <= 8) {
      setNicknameState(newNickname);
    }
  };
  const nicknameDupValue = useRecoilValue(nicknameDupState);

  return (
    <Container>
      <div className="desc">닉네임</div>
      <Input
        $isTyped={nicknameValue.length > 0}
        $isNicknameAvailable={checkValue.isNicknameAvailable}
        $isNicknameDuplicated={nicknameDupValue}
        placeholder="닉네임 (최소 3자에서 최대 8자의 한글)"
        value={nicknameValue}
        onChange={(event) => handleNicknameChange(event.target.value)}
      />
      <AvailableDiv
        $isVisible={nicknameValue.length > 0}
        $isNicknameAvailable={checkValue.isNicknameAvailable}
      >
        {checkValue.isNicknameAvailable
          ? "사용 가능한 닉네임입니다."
          : "닉네임은 3~8자의 한글이어야 합니다."}
      </AvailableDiv>
      <DuplicatedDiv $isNicknameDuplicated={nicknameDupValue}>
        중복된 닉네임입니다.
      </DuplicatedDiv>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;

const Input = styled.input<{
  $isTyped: boolean;
  $isNicknameAvailable: boolean;
  $isNicknameDuplicated: boolean;
}>`
  width: calc(100% - 4rem);
  height: 1.75rem;
  margin-bottom: 3rem;
  padding: 1rem 2rem;
  color: ${(props) => props.theme.colors.text};
  background-color: ${(props) => props.theme.colors.background + "3F"};
  border: solid 1px;
  border-color: ${(props) =>
    !props.$isTyped
      ? props.theme.colors.cancel
      : props.$isNicknameAvailable && !props.$isNicknameDuplicated
      ? props.theme.colors.primary
      : props.theme.colors.danger};
  border-radius: 0.5rem;
  &:focus {
    outline: none;
    border: solid 1px
      ${(props) =>
        !props.$isTyped
          ? props.theme.colors.primary
          : !props.$isNicknameAvailable || props.$isNicknameDuplicated
          ? props.theme.colors.danger
          : props.theme.colors.primary};
  }
`;

const AvailableDiv = styled.div<{
  $isVisible: boolean;
  $isNicknameAvailable: boolean;
}>`
  position: absolute;
  top: 7rem;
  left: 0.5rem;
  color: ${(props) =>
    props.$isNicknameAvailable
      ? props.theme.colors.primary
      : props.theme.colors.danger};
  font-size: 0.75rem;
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
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
