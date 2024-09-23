import signupState from "@store/signupState";
import { useRecoilState } from "recoil";
import styled from "styled-components";

const NicknameInput = () => {
  const [signupData, setSignupData] = useRecoilState(signupState);
  const nickname = signupData.nickname;

  function handleNicknameChange(nickname: string) {
    if (nickname.length <= 8) {
      setSignupData({ ...signupData, nickname });
    }
  }

  return (
    <div>
      <div className="desc">닉네임</div>
      <Input
        placeholder="닉네임 (최소 3자에서 최대 8자의 한글)"
        value={nickname}
        onChange={(event) => handleNicknameChange(event.target.value)}
      />
    </div>
  );
};

const Input = styled.input`
  width: 21rem;
  height: 1.75rem;
  margin: 0 0 1.5rem 0;
  padding: 1rem 2rem;
  color: ${(props) => props.theme.colors.text};
  background-color: ${(props) => props.theme.colors.background + "3F"};
  border: ${(props) => (props.theme.mode === "dark" ? "none" : "solid 1px")};
  border-color: ${(props) => props.theme.colors.placeholder};
  border-radius: 0.5rem;
  &:focus {
    outline: solid 1px ${(props) => props.theme.colors.primary};
  }
`;

export default NicknameInput;
