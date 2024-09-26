import styled from "styled-components";

const NewsListItem: React.FC<{ title: string }> = ({ title }) => {
  return <Container>{title}</Container>;
};

const Container = styled.div`
  height: 5.25rem;
`;

export default NewsListItem;
