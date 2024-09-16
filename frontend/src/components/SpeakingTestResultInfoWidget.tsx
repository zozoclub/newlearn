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
      <br />
      <Estimate>{estimate}</Estimate>
      <br />
      <br />
      <Explain>{content}</Explain>
    </SubContainer>
  );
};

export default SpeakingTestResultInfoWidget;

const SubContainer = styled.div`
  display: flex;
  flex-direction: column;

  min-height: 15rem;

  margin: 0.25rem;
  padding: 1rem;

  background-color: #${"62B7FF" + "2F"};

  border-radius: 0.75rem;
`;

const Title = styled.div`
  color: ${(props) => props.theme.colors.primaryPress};
  font-size: 1.25rem;
  font-weight: bold;
`;

const Estimate = styled.div`
  font-size: 1.125rem;
  font-weight: 400;
`;

const Explain = styled.div`
  font-size: 1rem;
  font-weight: 200;
`;
