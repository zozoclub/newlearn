import { usePageTransition } from "@hooks/usePageTransition";
import styled from "styled-components";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  category: number;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  category,
}) => {
  const pageGroup = Math.ceil(currentPage / 10);
  const lastPage = pageGroup * 10 > totalPages ? totalPages : pageGroup * 10;
  const firstPage = lastPage - 9 <= 0 ? 1 : lastPage - 9;
  const transitionTo = usePageTransition();

  const firstButtonHandle = () => {
    window.scrollTo(0, 0);
    transitionTo(`/news/${category}/1`);
  };

  const prevButtonHandle = () => {
    window.scrollTo(0, 0);
    transitionTo(`news/${category}/${currentPage - 1}`);
  };

  const nextButtonHandle = () => {
    window.scrollTo(0, 0);
    transitionTo(`news/${category}/${currentPage + 1}`);
  };

  const lastButtonHandle = () => {
    window.scrollTo(0, 0);
    transitionTo(`/news/${category}/${lastPage}`);
  };

  const pageButtonHandle = (page: number) => {
    window.scrollTo(0, 0);
    transitionTo(`news/${category}/${page}`);
  };

  return (
    <Container>
      <PageButton onClick={firstButtonHandle}>{"<<"}</PageButton>
      <PageButton
        style={{ visibility: currentPage === 1 ? "hidden" : "visible" }}
        onClick={prevButtonHandle}
      >
        {"<"}
      </PageButton>
      {[...Array(lastPage - firstPage + 1)].map((_, index) => {
        const pageNumber = firstPage + index;
        return (
          <PageButton
            key={pageNumber}
            onClick={() => pageButtonHandle(pageNumber)}
            $active={pageNumber === currentPage}
          >
            {pageNumber}
          </PageButton>
        );
      })}
      <PageButton
        style={{
          visibility: currentPage === totalPages ? "hidden" : "visible",
        }}
        onClick={nextButtonHandle}
      >
        {">"}
      </PageButton>
      <PageButton onClick={lastButtonHandle}>{">>"}</PageButton>
    </Container>
  );
};

export default Pagination;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const PageButton = styled.div<{ $active?: boolean }>`
  padding: 1rem;
  color: ${(props) =>
    props.$active ? props.theme.colors.primary : props.theme.colors.text};
  font-weight: 600;
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.colors.primaryPress};
  }
`;
