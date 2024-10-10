import { difficultyState } from "@store/signUpState";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

type WordType = {
  [key: string]: string;
};

type WordWithLevel = {
  word: string;
  meaning: string;
  level: string;
};

const A1Data: WordType[] = [
  { cheap: "값싼" },
  { geography: "지리학" },
  { library: "도서관" },
  { different: "다른, 차이가 나는" },
  { mountain: "산" },
  { popular: "인기 있는" },
  { spend: "쓰다, 소비하다" },
  { umbrella: "우산" },
  { vacation: "휴가" },
  { quarter: "4분의 1, 15분" },
  { imagine: "상상하다" },
];

const A2Data: WordType[] = [
  { argument: "논쟁, 말다툼" },
  { blood: "혈액, 피" },
  { church: "교회" },
  { competition: "경쟁, 대회" },
  { definitely: "확실히" },
  { environment: "환경" },
  { illness: "질병" },
  { lecture: "강의" },
  { medicine: "약, 의학" },
  { pollution: "오염" },
  { specific: "구체적인, 특정한" },
];

const B1Data: WordType[] = [
  { alternative: "대안, 대체" },
  { assignment: "과제, 임무" },
  { chest: "가슴, 흉부" },
  { comparison: "비교" },
  { destination: "목적지" },
  { donate: "기부하다" },
  { fascinating: "매혹적인" },
  { generation: "세대" },
  { indicate: "나타내다, 가리키다" },
  { needle: "바늘" },
  { pale: "창백한" },
  { profit: "이익" },
  { punishment: "처벌" },
  { qualify: "자격을 얻다" },
  { reflect: "반사하다, 반영하다" },
  { responsibility: "책임" },
  { sculpture: "조각" },
  { standard: "표준" },
  { summarize: "요약하다" },
  { throughout: "도처에, ~동안 내내" },
  { typically: "전형적으로" },
  { violent: "폭력적인" },
];

const B2Data: WordType[] = [
  { abandon: "버리다, 포기하다" },
  { aggressive: "공격적인" },
  { assess: "평가하다" },
  { capable: "능력 있는" },
  { contribute: "기여하다" },
  { debate: "토론하다" },
  { enhance: "향상시키다" },
  { flexible: "유연한" },
  { generate: "생성하다" },
  { hesitate: "주저하다" },
  { impact: "영향" },
  { justify: "정당화하다" },
  { launch: "발사하다, 시작하다" },
  { maintain: "유지하다" },
  { negotiate: "협상하다" },
  { obtain: "얻다" },
  { perspective: "관점" },
  { quote: "인용하다" },
  { resist: "저항하다" },
  { secure: "안전한" },
  { transform: "변형하다" },
  { unique: "독특한" },
  { valuable: "가치 있는" },
  { witness: "목격자" },
  { adapt: "적응하다" },
  { crucial: "중요한" },
  { emphasize: "강조하다" },
  { investigate: "조사하다" },
  { modify: "수정하다" },
  { pursue: "추구하다" },
];

const C1Data: WordType[] = [
  { abolish: "폐지하다" },
  { accountability: "책임" },
  { consolidate: "통합하다" },
  { deficiency: "결핍" },
  { empirical: "경험적인" },
  { facilitate: "용이하게 하다" },
  { genocide: "대량 학살" },
  { hierarchy: "계층 구조" },
  { integrity: "정직성, 무결성" },
  { jurisdiction: "관할권" },
  { keen: "열망하는" },
  { legitimate: "합법적인" },
  { manipulate: "조종하다" },
  { notorious: "악명 높은" },
  { optimize: "최적화하다" },
  { perpetrate: "저지르다" },
  { quantify: "정량화하다" },
  { resilient: "탄력적인" },
  { scrutiny: "정밀 조사" },
  { tenacious: "끈질긴" },
  { underlying: "근본적인" },
  { validity: "유효성" },
  { warfare: "전쟁" },
  { yield: "산출하다" },
  { affirm: "확언하다" },
  { bureaucracy: "관료제" },
  { contemplate: "숙고하다" },
  { dilemma: "딜레마" },
  { endeavor: "노력" },
  { fluctuate: "변동하다" },
];

const getRandomItems = (
  arr: WordType[],
  n: number,
  level: string
): WordWithLevel[] => {
  return [...arr]
    .sort(() => 0.5 - Math.random())
    .slice(0, n)
    .map((item) => ({
      word: Object.keys(item)[0],
      meaning: Object.values(item)[0],
      level,
    }));
};

const selectedA1 = getRandomItems(A1Data, 2, "A1");
const selectedA2 = getRandomItems(A2Data, 2, "A2");
const selectedB1 = getRandomItems(B1Data, 4, "B1");
const selectedB2 = getRandomItems(B2Data, 5, "B2");
const selectedC1 = getRandomItems(C1Data, 3, "C1");

const combinedData = [
  ...selectedA1,
  ...selectedA2,
  ...selectedB1,
  ...selectedB2,
  ...selectedC1,
];

const score: { [key: string]: number } = {
  A1: 2,
  A2: 3,
  B1: 5,
  B2: 8,
  C1: 10,
};

type LevelTestProps = {
  setPageNum: (pageNum: number) => void;
};
const LevelTestPage: React.FC<LevelTestProps> = ({ setPageNum }) => {
  const [words, setWords] = useState<WordWithLevel[]>([]);
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [totalScore, setTotalScore] = useState<number>(0);
  const [isTestComplete, setIsTestComplete] = useState<boolean>(false);
  const setDifficultyState = useSetRecoilState(difficultyState);

  useEffect(() => {
    const randomizedWords = combinedData.sort(() => 0.5 - Math.random());
    console.log(randomizedWords);
    setWords(randomizedWords);
    setSelectedWords(new Set());
    setTotalScore(0);
  }, []);

  const toggleWordSelection = (word: string, level: string) => {
    if (isTestComplete) return; // 테스트 완료 후 선택 변경 방지
    const newSelectedWords = new Set(selectedWords);
    if (newSelectedWords.has(word)) {
      newSelectedWords.delete(word);
      setTotalScore((prevScore) => prevScore - score[level]);
    } else {
      newSelectedWords.add(word);
      setTotalScore((prevScore) => prevScore + score[level]);
    }
    setSelectedWords(newSelectedWords);
  };

  const calDifficulty = () => {
    if (totalScore <= 30) {
      return { level: "초급", value: 1 };
    } else if (totalScore > 30 && totalScore <= 70) {
      return { level: "중급", value: 2 };
    } else {
      return { level: "고급", value: 3 };
    }
  };

  useEffect(() => {
    const { value } = calDifficulty();
    setDifficultyState(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalScore]);

  const handleCompleteTest = () => {
    setIsTestComplete(true);
  };

  return (
    <PageContainer>
      <WordTest>
        <div>아는 단어를 모두 선택해 주세요.</div>
      </WordTest>
      <WordGrid>
        {words.map((item, index) => {
          return (
            <WordButton
              key={index}
              $isSelected={selectedWords.has(item.word)}
              onClick={() => toggleWordSelection(item.word, item.level)}
              disabled={isTestComplete}
            >
              {item.word}
            </WordButton>
          );
        })}
      </WordGrid>
      {isTestComplete ? (
        <ResultContainer $isVisible={isTestComplete}>
          테스트 결과 <Difficulty>{calDifficulty().level}</Difficulty> 수준
          입니다.
          <ButtonContainer>
            <SubmitButton onClick={() => setPageNum(3)}>다음</SubmitButton>
            <AgainButton onClick={() => setIsTestComplete(false)}>
              다시하기
            </AgainButton>
          </ButtonContainer>
        </ResultContainer>
      ) : (
        <CompleteTestButton
          $isVisible={!isTestComplete}
          onClick={handleCompleteTest}
        >
          선택 완료
        </CompleteTestButton>
      )}
    </PageContainer>
  );
};

export default LevelTestPage;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 40rem;
  margin: 0 auto;
`;

const WordTest = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  color: gray;
`;
const WordGrid = styled.div`
  display: grid;
  place-items: center;
  grid-template-columns: repeat(2, minmax(0, 2fr));
  grid-template-rows: repeat(8, 1fr);
  gap: 1rem 2rem;
  width: 100%;
`;

const WordButton = styled.button<{ $isSelected: boolean }>`
  width: 100%;
  font-weight: bold;
  padding: 0.75rem 1rem;
  font-size: 1.125rem;
  border: none;
  border-radius: 0.5rem;
  background-color: ${(props) =>
    props.$isSelected
      ? props.theme.colors.primary
      : props.theme.colors.readonly};
  color: ${(props) => (props.$isSelected ? "white" : props.theme.colors.text)};
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: ${(props) =>
      props.$isSelected ? props.theme.colors.primaryPress : "#e0e0e0"};
  }
`;

const Difficulty = styled.span`
  color: ${(props) => props.theme.colors.text};
  font-size: 1.5rem;
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  gap: 1rem;
  align-items: center;
`;

const Button = styled.button`
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
  font-weight: bold;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s;
`;

const SubmitButton = styled(Button)`
  background-color: ${(props) => props.theme.colors.primary};
  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
`;

const AgainButton = styled(Button)`
  background-color: ${(props) => props.theme.colors.placeholder};
  &:hover {
    background-color: ${(props) => props.theme.colors.text04};
  }
`;

const ResultContainer = styled.div<{ $isVisible: boolean }>`
  margin-top: 1.5rem;
  color: gray;
  font-size: 1.25rem;
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  transform: ${(props) => (props.$isVisible ? "scale(1)" : "scale(0.5)")};
  height: ${(props) => (props.$isVisible ? "auto" : "0")};
  overflow: hidden;
  transition: opacity 0.5s ease, transform 0.5s ease, height 0.5s ease;
`;

const CompleteTestButton = styled(Button)<{ $isVisible: boolean }>`
  margin-top: 3rem;
  background-color: ${(props) => props.theme.colors.primary};
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  transform: ${(props) => (props.$isVisible ? "scale(1)" : "scale(0.95)")};
  height: ${(props) => (props.$isVisible ? "auto" : "0")};
  overflow: hidden;
  transition: opacity 0.5s ease, transform 0.5s ease, height 0.5s ease;
  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
`;
