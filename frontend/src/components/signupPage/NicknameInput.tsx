import signupState from "@store/signupState";
import { useRecoilState } from "recoil";
import styled from "styled-components";

const NicknameInput: React.FC<{
  isNicknameAvailable: boolean;
  isNicknameDuplicated: boolean;
}> = ({ isNicknameAvailable, isNicknameDuplicated }) => {
  const [signupData, setSignupData] = useRecoilState(signupState);
  const nickname = signupData.nickname;

  function handleNicknameChange(nickname: string) {
    if (nickname.length <= 8) {
      setSignupData({ ...signupData, nickname });
    }
  }

  return (
    <Container>
      <div className="desc">닉네임</div>
      <Input
        $isNicknameAvailable={isNicknameAvailable}
        $isNicknameDuplicated={isNicknameDuplicated}
        placeholder="닉네임 (최소 3자에서 최대 8자의 한글)"
        value={nickname}
        onChange={(event) => handleNicknameChange(event.target.value)}
      />
      <AvailableDiv $isNicknameAvailable={isNicknameAvailable}>
        닉네임은 3~8자의 한글이어야 합니다.
      </AvailableDiv>
      <DuplicatedDiv $isNicknameDuplicated={isNicknameDuplicated}>
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
