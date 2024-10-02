import React, { useRef, useState } from "react";
import styled from "styled-components";

type CollapsibleProps = {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
};

const WordTestCollapsible: React.FC<CollapsibleProps> = ({
  title,
  isExpanded,
  onToggle,
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
      <ListItem>
        <Title onClick={toggleExpand}>
          <TitleContent>
            <TitleWord>{title}</TitleWord>
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

const ListItem = styled.div`
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
`;

const Title = styled.div`
  background-color: ${(props) => props.theme.shadows.medium};
  color: ${(props) => props.theme.colors.text};
  padding: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.25rem;
`;

const TitleContent = styled.div`
  min-width: 30%;
`;

const TitleWord = styled.span`
  color: ${(props) => props.theme.colors.text};
`;

const Arrow = styled.div<{ $isExpanded: boolean }>`
  font-size: 0.75rem;
  margin-left: auto;
  margin-top: 0.15rem;
  margin-right: 1rem;
  transform: ${({ $isExpanded }) =>
    $isExpanded ? "rotate(180deg)" : "rotate(0deg)"};
  transition: transform 0.2s ease;
`;

const ContentContainer = styled.div<{ $isExpanded: boolean }>`
  overflow: hidden;
  transition: height 0.2s ease-in-out;
  height: ${({ $isExpanded }) => ($isExpanded ? "auto" : "0")};
`;

const Content = styled.div`
  padding: 1rem;
  background-color: ${(props) => props.theme.shadows.medium};
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;
  line-height: 1.5;
`;
