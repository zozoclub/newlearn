import styled from "styled-components";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void; // 페이지 변경 함수 추가
  onNextPage: () => void; // 다음 페이지 변경 함수 추가
}

const MyPagePagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  onNextPage, // props로 추가된 다음 페이지 변경 함수
}) => {
  const pageGroup = Math.ceil(currentPage / 3);
  const lastPage = pageGroup * 3 > totalPages ? totalPages : pageGroup * 3;
  const firstPage = lastPage - 2 <= 0 ? 1 : lastPage - 2;

  const firstButtonHandle = () => onPageChange(1);
  const prevButtonHandle = () => onPageChange(currentPage - 1);
  const nextButtonHandle = () => onNextPage(); // 다음 페이지 버튼 핸들러로 변경
  const lastButtonHandle = () => onPageChange(lastPage);

  const pageButtons = [...Array(lastPage - firstPage + 1)].map((_, index) => {
    const pageNumber = firstPage + index;
    return (
      <PageButton
        key={pageNumber}
        onClick={() => onPageChange(pageNumber)}
        $active={pageNumber === currentPage}
      >
        {pageNumber}
      </PageButton>
    );
  });

  return (
    <Container>
      <PageButton onClick={firstButtonHandle}>{"<<"}</PageButton>
      <PageButton
        style={{ visibility: currentPage === 1 ? "hidden" : "visible" }}
        onClick={prevButtonHandle}
      >
        {"<"}
      </PageButton>
      {pageButtons}
      <PageButton
        style={{
          visibility: currentPage === totalPages ? "hidden" : "visible",
        }}
        onClick={nextButtonHandle} // 수정된 부분
      >
        {">"}
      </PageButton>
      <PageButton onClick={lastButtonHandle}>{">>"}</PageButton>
    </Container>
  );
};

export default MyPagePagination;

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
