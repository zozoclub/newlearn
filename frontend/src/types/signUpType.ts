export type SignUpStateType = {
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

export type CheckStateType = {
  isNicknameAvailable: boolean;
  isNicknameDuplicated: boolean;
  isDifficultySelected: boolean;
  isCategoriesSelected: boolean;
};
