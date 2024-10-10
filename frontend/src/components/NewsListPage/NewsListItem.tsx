import styled from "styled-components";
import goldMedal from "@assets/images/gold-medal.png";
import silverMedal from "@assets/images/silver-medal.png";
import bronzeMedal from "@assets/images/bronze-medal.png";
import { usePageTransition } from "@hooks/usePageTransition";
import lightThumbnailImage from "@assets/images/lightThumbnail.png";
import darkThumbnailImage from "@assets/images/darkThumbnail.png";
import { NewsType } from "types/newsType";
import { useMediaQuery } from "react-responsive";

const NewsListItem: React.FC<{ news: NewsType }> = ({ news }) => {
  const transitionTo = usePageTransition();
  const isTablet = useMediaQuery({ query: "(max-width: 1279px)" });

  return (
    <Container onClick={() => transitionTo(`/news/detail/${news.newsId}`)}>
      <ThumbnailImageDiv>
        {news.thumbnailImageUrl ? (
          <ThumbnailImage src={news.thumbnailImageUrl} />
        ) : (
          <>
            <ThumbnailImage src={lightThumbnailImage} />
            <DarkThumbnailImage src={darkThumbnailImage} />
          </>
        )}
      </ThumbnailImageDiv>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          width: "100%",
        }}
      >
        <Title>{news.title}</Title>
        {/* 데스크탑에서만 내용 표시 */}
        {!isTablet && <Content>{news.content}</Content>}
        <Footer>
          <CategoryButton>{news.category}</CategoryButton>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {news.isRead[2] && <Medal src={bronzeMedal} alt="" />}
            {news.isRead[1] && <Medal src={silverMedal} alt="" />}
            {news.isRead[0] && <Medal src={goldMedal} alt="" />}
          </div>
        </Footer>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: 13rem;
  margin: 1rem 0;
  border-radius: 1rem;
  background-color: ${(props) => props.theme.colors.newsItemBackground};
  overflow: hidden;
  transition: background-color 0.5s;
  cursor: pointer;
  box-shadow: ${(props) => props.theme.shadows.small};
  &:hover {
    background-color: ${(props) => props.theme.colors.newsItemBackgroundPress};
  }
  @media screen and (min-width: 768px) {
    padding: 2rem;
  }
  @media screen and (max-width: 1279px) {
    height: 10rem;
  }
  @media (max-width: 767px) {
    height: 100%;
    box-shadow: none;
    border-radius: 2px;
    margin: 0;
    padding: 0.75rem 0.5rem;
    background-color: transparent;
    border-bottom: 1px solid ${(props) => props.theme.colors.mobileBorder};
  }
`;

const ThumbnailImageDiv = styled.div`
  position: relative;
  width: 25%;
  height: 100%;
  margin-right: 2.5rem;
  object-fit: cover;
  @media screen and (min-width: 1280px) {
    min-width: 20rem;
  }
  @media screen and (max-width: 1279px) {
    aspect-ratio: 1.6;
  }
  @media (max-width: 768px) {
    min-width: 7rem;
    height: 4.5rem;
    margin-right: 1rem;
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  object-fit: cover;
  @media screen and (min-width: 1280px) {
    width: 20rem;
  }
  @media screen and (max-width: 1279px) {
    aspect-ratio: 1.6;
  }
  @media (max-width: 768px) {
    width: 7rem;
    height: 4.5rem;
    border-radius: 5px;
  }
`;

const DarkThumbnailImage = styled(ThumbnailImage)`
  position: absolute;
  left: 0;
  opacity: ${(props) => (props.theme.mode === "dark" ? 1 : 0)};
  transition: opacity 0.3s;
`;

const Title = styled.div`
  margin-bottom: 1rem;
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 2.5rem;
  height: 5rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  width: 100%;
  @media (max-width: 768px) {
    height: auto;
    font-weight: 600;
    font-size: 1rem;
    line-height: 1.25rem;
    margin-bottom: 0rem;
    text-overflow: ellipsis;
  }
`;

const Content = styled.div`
  width: 95%;
  font-size: 1.25rem;
  line-height: 2rem;
  height: 4rem;
  margin-bottom: 1rem;
  opacity: 0.8;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  @media (max-width: 768px) {
    display: none;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 768px) {
    margin-right: 1rem;
  }
`;

const CategoryButton = styled.button`
  min-height: 2.5rem;
  padding: 0 1rem;
  border-radius: 0.75rem;
  color: #ffffff;
  background-color: ${(props) => props.theme.colors.primary};
  transition: background-color 0.5s;
  border: none;

  @media (max-width: 768px) {
    min-height: 1.5rem;
    padding: 0.375rem 0rem;
    font-size: 0.875rem;
    background: none;
    color: ${(props) => props.theme.colors.text04};
  }
`;

const Medal = styled.img`
  width: 2.5rem;
  @media (max-width: 768px) {
    width: 1.75rem;
    height: 1.75rem;
  }
`;

export default NewsListItem;
