import React from "react";
import styled from "styled-components";

type Props = {
  title: string;
  estimate?: string;
  content?: string;
};

const SpeakingTestResultInfoWidgetMobile: React.FC<Props> = ({
  title,
  estimate,
  content,
}) => {
  return (
    <SubContainer>
      <TextLayout>
        <Title>{title}</Title>
        <Explain>{content}</Explain>
        <br />
        <Estimate>{estimate}</Estimate>
      </TextLayout>
    </SubContainer>
  );
};

export default SpeakingTestResultInfoWidgetMobile;

const SubContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
  background-color: ${(props) => props.theme.colors.newsItemBackground};
  border-radius: 0.75rem;
`;

const Title = styled.div`
  color: ${(props) => props.theme.colors.primary};
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.125rem;
`;

const Explain = styled.div`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text04};
  font-weight: 300;
`;

const Estimate = styled.div`
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.3;
`;

const TextLayout = styled.div`
  margin: 1rem;
`