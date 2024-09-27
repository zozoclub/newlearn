import { NewsType } from "@services/newsService";
import styled from "styled-components";
import goldMedal from "@assets/images/gold-medal.png";
import silverMedal from "@assets/images/silver-medal.png";
import bronzeMedal from "@assets/images/bronze-medal.png";

const NewsListItem: React.FC<{ news: NewsType }> = ({ news }) => {
  return (
    <Container>
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
  height: 15rem;
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 1rem;
  background-color: #0000003f;
  overflow: hidden;
  transition: background-color 0.5s;
  cursor: pointer;
  &:hover {
    background-color: #000000aa;
  }
`;

const ThumbnailImage = styled.div`
  min-width: 20rem;
  height: 15rem;
  margin-right: 1rem;
  img {
    width: 20rem;
    height: 15rem;
    border-radius: 1rem;
    object-fit: fill;
  }
`;

const Title = styled.div`
  width: 60%;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 2rem;
  height: 4rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

const Content = styled.div`
  font-size: 1.25rem;
  line-height: 1.5rem;
  height: 7.5rem;
  margin-bottom: 0.5rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
`;

const Category = styled.div`
  display: flex;
`;

const CategoryButton = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
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
  right: 8rem;
`;
const SilverMedal = styled(Medal)`
  right: 3.75rem;
`;
const BronzeMedal = styled(Medal)`
  right: 0rem;
`;

export default NewsListItem;
