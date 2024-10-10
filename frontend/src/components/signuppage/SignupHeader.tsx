import BackArrow from "@assets/icons/BackArrow";
import styled from "styled-components";

const SignupHeader: React.FC<{
  pageNum: number;
  setPageNum: React.Dispatch<React.SetStateAction<number>>;
}> = ({ pageNum, setPageNum }) => {
  return (
    <Container>
      <BackArrowDiv>
        <BackArrow width={36} height={36} />
      </BackArrowDiv>
      <div style={{ fontWeight: 600 }}>회원가입</div>
      {pageNum === 2 && (
        <PrevButton onClick={() => setPageNum(1)}>이전</PrevButton>
      )}
      {pageNum === 3 && (
        <PrevButton onClick={() => setPageNum(2)}>이전</PrevButton>
      )}
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
  @media screen and (max-width: 767px) {
    position: absolute;
    top: 2rem;
  }
`;

const BackArrowDiv = styled.div`
  position: absolute;
  left: 0;
  @media screen and (max-width: 767px) {
    left: 2rem;
  }
`;

const PrevButton = styled.div`
  position: absolute;
  right: 0;
  font-size: 1rem;
  cursor: pointer;
  @media screen and (max-width: 767px) {
    right: 2rem;
  }
`;

export default SignupHeader;
