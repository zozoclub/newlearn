import styled from "styled-components";
import EditIcon from "@assets/icons/EditIcon";

const MyPageInfo: React.FC = () => {
  const difficulty = "초급";
  const category = ["경제", "사회/문화", "정치"];

  const handleDifficultyEdit = () => {
    alert("난이도 수정 버튼");
  };

  const handleCategoryEdit = () => {
    alert("카테고리 수정 버튼");
  };
  return (
    <div>
      <Container>
        <TitleContainer>영어 난이도</TitleContainer>
        <ContentContainer>{difficulty}</ContentContainer>
        <IconContainer>
          <EditIcon onClick={handleDifficultyEdit} />
        </IconContainer>
      </Container>
      <StyledHr />
      <Container>
        <TitleContainer>카테고리</TitleContainer>
        <ContentContainer>
          {category.map((item) => (
            <div>{item}</div>
          ))}
        </ContentContainer>
        <IconContainer>
          <EditIcon onClick={handleCategoryEdit} />
        </IconContainer>
      </Container>
    </div>
  );
};

export default MyPageInfo;

const Container = styled.div`
  display: flex;
  padding: 0.75rem 1rem;
`;

const TitleContainer = styled.div`
  flex: 4;
  font-size: 1.25rem;
  font-weight: bold;
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 4;
  gap: 0.875rem;
  flex-direction: column;
  font-size: 1.25rem;
`;

const IconContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`;

const StyledHr = styled.hr`
  height: 1px;
  margin: 0.5rem;
  background-color: ${(props) => props.theme.colors.text04};
  border: none;
`;
