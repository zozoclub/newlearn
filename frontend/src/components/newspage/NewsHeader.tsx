import styled from "styled-components";
import LoadingDiv from "./LoadingDiv";
import LoadingBar from "./LoadingBar";
import { DetailNewsType } from "@services/newsService";
import { useRecoilValue } from "recoil";
import languageState from "@store/languageState";
import LanguageToggleBtn from "./LanguageToggleBtn";
import DifficultyToggleBtn from "./DifficultyToggleBtn";

const NewsHeader: React.FC<{
  engIsLoading: boolean;
  korIsLoading: boolean;
  engData: DetailNewsType | undefined;
  korData: DetailNewsType | undefined;
  difficulty: number;
  setDifficulty: React.Dispatch<React.SetStateAction<number>>;
  isRead: boolean[] | undefined;
  setIsReadFinished: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  engIsLoading,
  korIsLoading,
  engData,
  korData,
  difficulty,
  setDifficulty,
  setIsReadFinished,
}) => {
  const languageData = useRecoilValue(languageState);
  return (
    <Container>
      <NewsCategory>
        {engIsLoading || korIsLoading ? (
          <LoadingDiv>
            <LoadingBar />
          </LoadingDiv>
        ) : (
          <>{engData?.category}</>
        )}
      </NewsCategory>
      <NewsTitle>
        {engIsLoading || korIsLoading ? (
          <LoadingDiv>
            <LoadingBar />
          </LoadingDiv>
        ) : (
          <>{languageData === "en" ? engData?.title : korData?.title}</>
        )}
      </NewsTitle>
      {engIsLoading || korIsLoading ? (
        <>
          <LoadingDiv>
            <LoadingBar />
          </LoadingDiv>
        </>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <NewsDate>
            {languageData === "en"
              ? engData?.publishedDate
              : korData?.publishedDate}
          </NewsDate>
          <OriginalUrlButton
            onClick={() => (window.location.href = `${engData?.originalUrl}`)}
          >
            기사원문
          </OriginalUrlButton>
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          position: "relative",
          gap: "0.5rem",
          marginTop: "0.5rem",
        }}
      >
        {engIsLoading || korIsLoading ? (
          <div style={{ width: "calc(100% - 20rem)" }}>
            <LoadingDiv>
              <LoadingBar />
            </LoadingDiv>
          </div>
        ) : (
          <>
            <PressDiv>{engData?.press}</PressDiv>
            <div>|</div>
            <JournalistDiv>{engData?.journalist}</JournalistDiv>
            <HitDiv>조회 {engData?.hit}</HitDiv>
          </>
        )}
        <SettingDiv>
          <LanguageToggleBtn />
          <DifficultyToggleBtn
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            isRead={engData?.isRead[difficulty - 1]}
            setIsReadFinished={setIsReadFinished}
          />
        </SettingDiv>
      </div>
    </Container>
  );
};

export default NewsHeader;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const NewsCategory = styled.div`
  width: 5rem;
  color: ${(props) => props.theme.colors.text02};
`;

const NewsTitle = styled.div`
  width: 80%;
  font-size: 1.75rem;
  font-weight: 600;
`;

const NewsDate = styled.div`
  color: ${(props) => props.theme.colors.text03};
`;

const OriginalUrlButton = styled.button`
  padding: 0.25rem 0.5rem;
  background-color: ${(props) => props.theme.colors.readonly};
  border: 1px solid ${(props) => props.theme.colors.placeholder};
  border-radius: 0.5rem;
  cursor: pointer;
`;

const PressDiv = styled.div``;

const JournalistDiv = styled.div``;

const HitDiv = styled.div`
  color: ${(props) => props.theme.colors.text03};
  margin-left: 0.5rem;
`;

const SettingDiv = styled.div`
  display: flex;
  gap: 2.5rem;
  position: absolute;
  right: 0;
`;
