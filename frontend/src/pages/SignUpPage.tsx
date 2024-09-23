import BackArrow from "@assets/icons/BackArrow";
import Button from "@components/Button";
import { usePageTransition } from "@hooks/usePageTransition";
import { getOAuthInformation, signUp } from "@services/userService";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

export type SignUpType = {
  email: string;
  name: string;
  provider: string;
  providerId: string;
  nickname: string;
  difficulty: number;
  categories: string[];
  skin: number;
  eyes: number;
  mask: number;
};

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SignUpPage = () => {
  const categories = [
    { name: "전체" },
    { name: "경제" },
    { name: "사회" },
    { name: "연예" },
    { name: "IT/과학" },
    { name: "몰라" },
  ];
  const difficulties = [
    { id: 1, difficulty: "초급" },
    { id: 2, difficulty: "중급" },
    { id: 3, difficulty: "고급" },
  ];
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("");
  const [providerId, setProviderId] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [skin, setSkin] = useState(0);
  const [eyes, setEyes] = useState(0);
  const [mask, setMask] = useState(0);
  const [activeButton, setActiveButton] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const query = useQuery();
  const transitionTo = usePageTransition();

  function handleNicknameChange(nickname: string) {
    if (nickname.length <= 8) {
      setNickname(nickname);
    }
  }
  const handleCategoryClick = (CategoryName: string) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(CategoryName)) {
        return prevSelected.filter((name) => name !== CategoryName);
      } else if (prevSelected.length < 3) {
        return [...prevSelected, CategoryName];
      }
      return prevSelected;
    });
  };

  const handleDifficultyClick = (difficulty: number) => {
    setSelectedDifficulty(difficulty);
  };

  function checkNickname(): boolean {
    if (nickname.length < 3) {
      return false;
    }
    return /^[가-힣ㄱ-ㅎㅏ-ㅣ]+$/.test(nickname);
  }

  function checkInterest(): boolean {
    return selectedCategories.length === 3;
  }

  function checkDifficulty(): boolean {
    return selectedDifficulty !== 0;
  }

  // 주소로부터 토큰 획득
  useEffect(() => {
    const token = query.get("token");
    setToken(token);
  }, [query]);

  // 토큰으로 유저 정보(이메일, 이름, 제공자) 가져오기
  useEffect(() => {
    const getOAuth = async () => {
      try {
        if (token !== null) {
          const response = await getOAuthInformation(token);
          setEmail(response.email);
          setName(response.name);
          setProvider(response.provider);
          setProviderId(response.providerId);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getOAuth();
  }, [token]);

  // 유효성 검사
  useEffect(() => {
    if (!checkNickname()) {
      console.log("닉네임 체크");
      setActiveButton(false);
    } else if (!checkInterest()) {
      console.log("관심 카테고리 체크");
      setActiveButton(false);
    } else if (!checkDifficulty()) {
      console.log("난이도 체크");
      setActiveButton(false);
    } else {
      setActiveButton(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nickname, selectedDifficulty, selectedCategories]);

  return (
    <Container>
      <Header>
        <BackArrowDiv>
          <BackArrow width={36} height={36} />
        </BackArrowDiv>
        회원가입
      </Header>
      <form onSubmit={(event) => event.preventDefault()}>
        {/* 닉네임 */}
        <div>
          <div className="desc">닉네임</div>
          <Input
            placeholder="닉네임 (최소 3자에서 최대 8자의 한글)"
            value={nickname}
            onChange={(event) => handleNicknameChange(event.target.value)}
          />
        </div>
        {/* 관심 카테고리 */}
        <div className="category">
          <div className="desc">
            관심 카테고리
            <CategoryCount>{selectedCategories.length}/3</CategoryCount>
          </div>
          <div className="buttons">
            {categories.map((category) => (
              <Button
                key={category.name}
                $varient={
                  selectedCategories.includes(category.name)
                    ? "primary"
                    : "cancel"
                }
                size={"medium"}
                onClick={() => {
                  handleCategoryClick(category.name);
                }}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
        {/* 영어 실력 */}
        <div className="difficulty">
          <div className="desc">영어 실력</div>
          <div className="buttons">
            {difficulties.map((difficulty) => (
              <Button
                key={difficulty.difficulty}
                $varient={
                  selectedDifficulty === difficulty.id ? "primary" : "cancel"
                }
                size={"medium"}
                onClick={() => handleDifficultyClick(difficulty.id)}
              >
                {difficulty.difficulty}
              </Button>
            ))}
          </div>
        </div>
        {/* 입력 완료 버튼 */}
        <div>
          <Button
            $varient={activeButton ? "primary" : "cancel"}
            size="large"
            onClick={() => {
              if (activeButton) {
                try {
                  signUp({
                    email,
                    name,
                    provider,
                    providerId,
                    nickname,
                    difficulty: selectedDifficulty,
                    categories: selectedCategories,
                    skin,
                    eyes,
                    mask,
                  });
                  transitionTo("/login");
                } catch (error) {
                  console.log(error);
                }
              }
            }}
          >
            입력 완료
          </Button>
        </div>
      </form>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  width: 27.25rem;
  padding: 2rem 2rem 2rem 2rem;
  border-radius: 0.5rem;
  background-color: ${(props) => props.theme.colors.cardBackground + "7F"};
  transition: box-shadow 0.5s;
  backdrop-filter: blur(4px);
  box-shadow: 0.5rem 0.5rem 0.25rem ${(props) => props.theme.colors.shadow};
  ::placeholder {
    font-weight: 600;
    color: ${(props) => props.theme.colors.placeholder};
  }
  .desc {
    display: flex;
    margin: 1.25rem 0;
    align-items: center;
    font-size: 1.25rem;
  }
  .category,
  .difficulty {
    .buttons {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 1.25rem;
      margin: 1.5rem 0 3rem 0;
    }
  }
`;

const Header = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  margin-bottom: 2rem;
  font-size: 1.75rem;
  justify-content: center;
  align-items: center;
`;

const BackArrowDiv = styled.div`
  position: absolute;
  left: 0;
`;

const Input = styled.input`
  width: 21rem;
  height: 1.75rem;
  margin: 0 0 1.5rem 0;
  padding: 1rem 2rem;
  color: ${(props) => props.theme.colors.text};
  background-color: ${(props) => props.theme.colors.background + "3F"};
  border: ${(props) => (props.theme.mode === "dark" ? "none" : "solid 1px")};
  border-color: ${(props) => props.theme.colors.placeholder};
  border-radius: 0.5rem;
  &:focus {
    outline: solid 1px ${(props) => props.theme.colors.primary};
  }
`;

const CategoryCount = styled.div`
  margin-left: 0.5rem;
  color: ${(props) => props.theme.colors.primary};
  font-size: 1rem;
`;

export default SignUpPage;
