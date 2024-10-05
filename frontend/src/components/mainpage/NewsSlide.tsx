import React from "react";
import styled from "styled-components";
import lightThumbnailImage from "@assets/images/lightThumbnail.png";
import darkThumbnailImage from "@assets/images/darkThumbnail.png";

interface NewsSlideProps {
  image: string;
  title: string;
  content: string;
}

const NewsSlide: React.FC<NewsSlideProps> = ({ image, title, content }) => (
  <>
    {image ? (
      <ThumbnailImage loading="lazy" src={image} alt="news" />
    ) : (
      <>
        <ThumbnailImage src={lightThumbnailImage} />
        <DarkThumbnailImage src={darkThumbnailImage} />
      </>
    )}
    <NewsContent>
      <div className="title">{title}</div>
      <div className="content">{content}</div>
    </NewsContent>
  </>
);

const ThumbnailImage = styled.img`
  width: 580px;
  height: 340px;
  border-radius: 0.5rem;
  opacity: 0.9;
  object-fit: cover; // 이미지 비율 유지
`;
const DarkThumbnailImage = styled(ThumbnailImage)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  opacity: ${(props) => (props.theme.mode === "dark" ? 1 : 0)};
  transition: opacity 0.3s;
`;

const NewsContent = styled.div`
  position: absolute;
  bottom: 0rem;
  left: 0rem;
  width: calc(100% - 4rem);
  margin: 1rem;
  padding: 1rem 1rem;
  border-radius: 0.5rem;
  background-color: ${(props) => props.theme.colors.cardBackground01};
  color: ${(props) => props.theme.colors.text};
  transition: background-color 0.3s ease;

  .title {
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.5rem;
    height: 1.5rem;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .content {
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
