import { ScrapNewsType } from "@services/mypageService";
import styled from "styled-components";
import goldMedal from "@assets/images/gold-medal.png";
import silverMedal from "@assets/images/silver-medal.png";
import bronzeMedal from "@assets/images/bronze-medal.png";
import { usePageTransition } from "@hooks/usePageTransition";

const NewsListItem: React.FC<{ news: ScrapNewsType }> = ({ news }) => {
  const transitionTo = usePageTransition();

  return (
    <Container onClick={() => transitionTo(`/news/detail/${news.newsId}`)}>
      <ThumbnailImage>
        <img src={news.thumbnailImageUrl} alt="noThumbnail" />
      </ThumbnailImage>
      <div style={{ position: "relative" }}>
        <Title>{news.title}</Title>
        <Content>{news.content}</Content>
        <Category>
          <CategoryButton>{news.category}</CategoryButton>
        </Category>
        {news.isRead[0] && <GoldMedal src={goldMedal} alt="" />}
        {news.isRead[1] && <SilverMedal src={silverMedal} alt="" />}
        {news.isRead[2] && <BronzeMedal src={bronzeMedal} alt="" />}
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
  background-color: #0000003f;
  overflow: hidden;
  transition: background-color 0.5s;
  cursor: pointer;
  &:hover {
    background-color: #000000aa;
  }

  @media (max-width: 768px) {
    height: 6.5rem;
    padding: 1rem;
    margin: 0;
    background-color: ${(props) => props.theme.colors.background};
    border-radius: 5px;
    border-bottom: 1px lightgray solid;
    &:hover {
      background-color: lightgray;
    }
  }
`;

const ThumbnailImage = styled.div`
  min-width: 20rem;
  height: 13rem;
  margin-right: 2.5rem;
  img {
    width: 20rem;
    height: 13rem;
    border-radius: 1rem;
    object-fit: fill;
  }
  @media (max-width: 768px) {
    min-width: 10rem;
    height: 6.5rem;
    margin-right: 1rem;
    img {
      width: 10rem;
      height: 6.5rem;
      border-radius: 5px;
    }
  }
`;

const Title = styled.div`
  width: 70%;
  margin-bottom: 1rem;
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 2.5rem;
  height: 2.5rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  @media (max-width: 768px) {
    font-size: 1.25rem;
    line-height: 1.25rem;
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

const Category = styled.div`
  display: flex;
`;

const CategoryButton = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  color: white;
  background-color: ${(props) => props.theme.colors.primary};
  transition: background-color 0.5s;
  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
`;

const Medal = styled.img`
  position: absolute;
  top: 0;
  @media (max-width: 768px) {
    width: 2rem;
  }
`;

const GoldMedal = styled(Medal)`
  right: 8rem;
  @media (max-width: 768px) {
    right: 4rem;
  }
`;
const SilverMedal = styled(Medal)`
  right: 3.75rem;
  @media (max-width: 768px) {
    right: 2rem;
  }
`;
const BronzeMedal = styled(Medal)`
  right: 0rem;
`;

export default NewsListItem;
