import React from "react";
import styled from "styled-components";

type Props = {
  title: string;
  estimate?: string;
  content?: string;
};

const SpeakingTestResultInfoWidget: React.FC<Props> = ({
  title,
  estimate,
  content,
}) => {
  return (
    <SubContainer>
      <Title>{title}</Title>
      <br />
      <Explain>{content}</Explain>
      <br />
      <br />
      <Estimate>{estimate}</Estimate>
    </SubContainer>
  );
};

export default SpeakingTestResultInfoWidget;

const SubContainer = styled.div`
  display: flex;
  flex-direction: column;

  min-height: 10rem;

  margin: 0.25rem;
  padding: 1.5rem;

  background-color: ${(props) => props.theme.colors.newsItemBackground};

  border-radius: 0.75rem;
`;

const Title = styled.div`
  color: ${(props) => props.theme.colors.primary};
  font-size: 1.375rem;
  font-weight: 700;
`;

const Explain = styled.div`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text04};
  font-weight: 300;
`;

const Estimate = styled.div`
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.5;
`;

