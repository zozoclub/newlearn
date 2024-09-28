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
  padding: 1rem 1rem;
  border-radius: 0.5rem;
  background-color: #000000aa;
  color: #ffffff;
  h1 {
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
    font-weight: 800;
    line-height: 1.5rem;
    height: 1.5rem;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
  div {
    font-size: 1rem;
    line-height: 1.25rem;
    height: 2.5rem;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
`;

export default NewsSlide;
