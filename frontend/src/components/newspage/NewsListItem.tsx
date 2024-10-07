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
`;

const ThumbnailImageDiv = styled.div`
  position: relative;
  height: 100%;
  margin-right: 2.5rem;
  @media screen and (min-width: 1280px) {
    min-width: 20rem;
  }
  @media screen and (max-width: 1279px) {
    aspect-ratio: 1.6;
  }
`;

const ThumbnailImage = styled.img`
  height: 100%;
  border-radius: 1rem;
  object-fit: fill;
  @media screen and (min-width: 1280px) {
    width: 20rem;
  }
  @media screen and (max-width: 1279px) {
    aspect-ratio: 1.6;
  }
`;

const DarkThumbnailImage = styled(ThumbnailImage)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
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
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CategoryButton = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  color: #ffffff;
  background-color: ${(props) => props.theme.colors.primary};
  transition: background-color 0.5s;
  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
`;

const Medal = styled.img`
  width: 32px;
`;

export default NewsListItem;
