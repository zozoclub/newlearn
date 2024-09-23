import BackArrow from "@assets/icons/BackArrow";
import styled from "styled-components";

const SignupHeader = () => {
  return (
    <Container>
      <BackArrowDiv>
        <BackArrow width={36} height={36} />
      </BackArrowDiv>
      회원가입
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  margin-bottom: 2rem;
  font-size: 1.75rem;
  justify-content: center;
  align-items: center;
`;

const BackArrowDiv = styled.div`
  position: absolute;
  left: 0;
`;

export default SignupHeader;
