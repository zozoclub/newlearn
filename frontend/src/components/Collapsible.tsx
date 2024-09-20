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

  const onDeleteHandler = () => {
    // 삭제 로직 추가
  };

  return (
    <ListItem>
      <Title onClick={onToggle}>
        {title}
        <Arrow $isExpanded={isExpanded}>▼</Arrow>
        <DeleteButton onClick={onDeleteHandler}>&times;</DeleteButton>
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
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
`;

const Title = styled.div`
  background-color: ${(props) => props.theme.colors.shadow}7F;
  color: ${(props) => props.theme.colors.text};
  padding: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.25rem;
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
  background-color: ${(props) => props.theme.colors.shadow}4F;
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;
  line-height: 1.5;
`;

const DeleteButton = styled.div`
  color: ${(props) => props.theme.colors.danger};
`;
