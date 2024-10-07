import React, { useRef, useState } from "react";
import styled from "styled-components";

type CollapsibleProps = {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  isCorrect: boolean; // 맞았는지 틀렸는지를 전달받는 prop
  children?: React.ReactNode;
};

const WordTestCollapsible: React.FC<CollapsibleProps> = ({
  title,
  isExpanded,
  onToggle,
  isCorrect,
  children,
}) => {
  const [expanded, setExpanded] = useState<boolean>(isExpanded);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleExpand = () => {
    setExpanded((prev) => !prev);
    onToggle();
  };

  const currentHeight = expanded ? contentRef.current?.scrollHeight : 0;

  return (
    <>
      <ListItem $isCorrect={isCorrect} $isExpanded={expanded}>
        <Title onClick={toggleExpand} $isCorrect={isCorrect} $isExpanded={expanded}>
          <TitleContent>
            <TitleWord $isCorrect={isCorrect} $isExpanded={expanded}>
              {title}
            </TitleWord>
          </TitleContent>
          <Arrow $isExpanded={expanded}>▼</Arrow>
        </Title>
        <ContentContainer
          ref={contentRef}
          style={{ height: `${currentHeight}px` }}
          $isExpanded={expanded}
        >
          <Content>{children}</Content>
        </ContentContainer>
      </ListItem>
    </>
  );
};

export default WordTestCollapsible;

const ListItem = styled.div<{ $isCorrect: boolean; $isExpanded: boolean }>`
  width: 90%;
  border: 0.125rem solid
    ${(props) =>
    props.$isExpanded
      ? props.$isCorrect
        ? props.theme.colors.primary
        : props.theme.colors.danger
      : props.$isCorrect
        ? props.theme.colors.primary
        : props.theme.colors.danger};
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  background-color: transparent; /* 배경색을 투명하게 설정 */
`;

const Title = styled.div<{ $isCorrect: boolean; $isExpanded: boolean }>`
  color: ${(props) =>
    props.$isExpanded ? "white" : props.$isCorrect ? props.theme.colors.primary : props.theme.colors.danger};
  text-align: center;
  padding: 1rem 3rem;
  cursor: pointer;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) =>
    props.$isExpanded ? (props.$isCorrect ? props.theme.colors.primary : props.theme.colors.danger) : "transparent"};
`;

const TitleContent = styled.div`
  width: 100%;
`;

const TitleWord = styled.span<{ $isCorrect: boolean; $isExpanded: boolean }>`
  color: ${(props) => (props.$isExpanded ? "white" : props.$isCorrect ? props.theme.colors.primary : props.theme.colors.danger)};
  font-size: 1.125rem;

`;

const Arrow = styled.div<{ $isExpanded: boolean }>`
  font-size: 0.75rem;
  margin-left: auto;
  transform: ${({ $isExpanded }) => ($isExpanded ? "rotate(180deg)" : "rotate(0deg)")};
  transition: transform 0.3s ease;

`;

const ContentContainer = styled.div<{ $isExpanded: boolean }>`
  overflow: hidden;
  transition: height 0.3s ease-in-out;
  height: ${({ $isExpanded }) => ($isExpanded ? 'auto' : '0')};
`;


const Content = styled.div`
  padding: 1rem;
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;
  line-height: 1.3;
`;
