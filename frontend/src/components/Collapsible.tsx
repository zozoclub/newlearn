import React, { useRef } from "react";
import styled from "styled-components";

type CollapsibleProps = {
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
};

const Collapsible: React.FC<CollapsibleProps> = ({
  title,
  children,
  isExpanded,
  onToggle,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const currentHeight = isExpanded ? contentRef.current?.scrollHeight : 0;

  return (
    <ListItem>
      <Title onClick={onToggle}>
        {title}
        <Arrow $isExpanded={isExpanded}>▼</Arrow>
      </Title>
      <ContentContainer
        ref={contentRef}
        style={{ height: `${currentHeight}px` }}
        $isExpanded={isExpanded}
      >
        <Content>{children}</Content>
      </ContentContainer>
    </ListItem>
  );
};

export default Collapsible;

const ListItem = styled.div`
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
`;

const Title = styled.div`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  padding: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 1.25rem;
`;

const Arrow = styled.span<{ $isExpanded: boolean }>`
  transform: ${({ $isExpanded }) =>
    $isExpanded ? "rotate(180deg)" : "rotate(0deg)"};
  transition: transform 0.3s ease;
`;

const ContentContainer = styled.div<{ $isExpanded: boolean }>`
  overflow: hidden;
  transition: height 0.3s ease-in-out;
  height: ${({ $isExpanded }) => ($isExpanded ? "auto" : "0")};
`;

const Content = styled.div`
  padding: 1rem;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;
  line-height: 1.5;
`;
