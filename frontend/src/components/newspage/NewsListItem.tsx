import styled from "styled-components";
import goldMedal from "@assets/images/gold-medal.png";
import silverMedal from "@assets/images/silver-medal.png";
import bronzeMedal from "@assets/images/bronze-medal.png";
import { usePageTransition } from "@hooks/usePageTransition";
import lightThumbnailImage from "@assets/images/lightThumbnail.png";
import darkThumbnailImage from "@assets/images/darkThumbnail.png";
import { NewsType } from "types/newsType";

const NewsListItem: React.FC<{ news: NewsType }> = ({ news }) => {
  const transitionTo = usePageTransition();

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
      <div style={{ position: "relative" }}>
        <Title>{news.title}</Title>
        <Content>{news.content}</Content>
        <Category>
          <CategoryButton>{news.category}</CategoryButton>
        </Category>
        {news.isRead[2] && <BronzeMedal src={bronzeMedal} alt="" />}
        {news.isRead[1] && <SilverMedal src={silverMedal} alt="" />}
        {news.isRead[0] && <GoldMedal src={goldMedal} alt="" />}
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: 13rem;
  padding: 2rem;
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
`;

const ThumbnailImageDiv = styled.div`
  position: relative;
  min-width: 20rem;
  height: 13rem;
  margin-right: 2.5rem;
`;

const ThumbnailImage = styled.img`
  width: 20rem;
  height: 13rem;
  border-radius: 1rem;
  object-fit: fill;
`;

const DarkThumbnailImage = styled(ThumbnailImage)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  opacity: ${(props) => (props.theme.mode === "dark" ? 1 : 0)};
  transition: opacity 0.3s;
`;

const Title = styled.div`
  width: 70%;
  margin-bottom: 1rem;
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 2.5rem;
  height: 5rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
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

const Category = styled.div`
  display: flex;
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
  position: absolute;
  top: 0;
`;

const GoldMedal = styled(Medal)`
  right: 0rem;
`;
const SilverMedal = styled(Medal)`
  right: 3.75rem;
`;
const BronzeMedal = styled(Medal)`
  right: 8rem;
`;

export default NewsListItem;
