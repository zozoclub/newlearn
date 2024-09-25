import React from "react";
import styled from "styled-components";

const NewsSlide: React.FC<{ image: string; title: string; content: string }> =
  React.memo(({ image, title, content }) => (
    <>
      <img loading="lazy" src={image} alt="news" />
      <NewsContent>
        <h1>{title}</h1>
        <div>{content}</div>
      </NewsContent>
    </>
  ));

const NewsContent = styled.div`
  position: absolute;
  bottom: 0rem;
  left: 0rem;
  width: calc(100% - 4rem);
  margin: 1rem;
  padding: 2rem 1rem;
  border-radius: 0.5rem;
  background-color: ${(props) => props.theme.colors.cardBackground + "33"};
  color: #ffffff;
  h1 {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  div {
    font-size: 1rem;
  }
`;

export default NewsSlide;
