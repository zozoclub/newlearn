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

  min-height: 12rem;

  margin: 0.25rem;
  padding: 1.5rem;

  background-color: #${"62B7FF" + "2F"};

  border-radius: 0.75rem;
`;

const Title = styled.div`
  color: ${(props) => props.theme.colors.primary};
  font-size: 1.25rem;
  font-weight: 900;
`;

const Estimate = styled.div`
  font-size: 1.125rem;
  font-weight: 400;
`;

const Explain = styled.div`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.placeholder};
  font-weight: 300;
`;
