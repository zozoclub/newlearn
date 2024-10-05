import { AvatarType } from "@components/common/Avatar";

export type SignUpActionType = (typeof SignUpAction)[keyof typeof SignUpAction];
export const SignUpAction = {
  CHANGE_NICKNAME: "CHANGE_NICKNAME",
  CHANGE_CATEGORIES: "CHANGE_CATEGORIES",
  CHANGE_DIFFICULTY: "CHANGE_DIFFICULTY",
  CHANGE_AVATAR: "CHANGE_AVATAR",
  SET_OAUTH_INFORMATION: "SET_OAUTH_INFORMATION",
} as const;

export type SignUpActionObject =
  | { type: typeof SignUpAction.CHANGE_NICKNAME; payload: string }
  | { type: typeof SignUpAction.CHANGE_CATEGORIES; payload: string }
  | { type: typeof SignUpAction.CHANGE_DIFFICULTY; payload: number }
  | { type: typeof SignUpAction.CHANGE_AVATAR; payload: AvatarType }
  | {
      type: typeof SignUpAction.SET_OAUTH_INFORMATION;
      payload: {
        email: string;
        name: string;
        provider: string;
        providerId: string;
      };
    };

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

export type CheckActionType = (typeof CheckAction)[keyof typeof CheckAction];
export const CheckAction = {
  CHECK_NICKNAME_AVAILABLE: "CHECK_NICKNAME_AVAILABLE",
  SET_NICKNAME_DUPLICATED: "SET_NICKNAME_DUPLICATED",
  CHECK_CATEGORIES: "CHECK_CATEGORIES",
  CHECK_DIFFICULTY: "CHECK_DIFFICULTY",
} as const;

export type CheckActionObject =
  | { type: typeof CheckAction.CHECK_NICKNAME_AVAILABLE; payload: string }
  | { type: typeof CheckAction.SET_NICKNAME_DUPLICATED; payload: boolean }
  | { type: typeof CheckAction.CHECK_CATEGORIES; payload: string[] }
  | { type: typeof CheckAction.CHECK_DIFFICULTY; payload: number };

export type CheckStateType = {
  isNicknameAvailable: boolean;
  isNicknameDuplicated: boolean;
  isDifficultySelected: boolean;
  isCategoriesSelected: boolean;
};
