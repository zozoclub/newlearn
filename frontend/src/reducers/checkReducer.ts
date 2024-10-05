import {
  CheckAction,
  CheckActionObject,
  CheckStateType,
} from "types/signUpType";

export const initialCheckState: CheckStateType = {
  isNicknameAvailable: true,
  isNicknameDuplicated: false,
  isCategoriesSelected: false,
  isDifficultySelected: false,
};

export const checkReducer = (
  state: CheckStateType,
  action: CheckActionObject
): CheckStateType => {
  switch (action.type) {
    case CheckAction.CHECK_NICKNAME_AVAILABLE:
      return {
        ...state,
        isNicknameDuplicated: false,
        isNicknameAvailable: /^[가-힣ㄱ-ㅎㅏ-ㅣ]{3,8}$/.test(action.payload),
      };
    case CheckAction.SET_NICKNAME_DUPLICATED: {
      return {
        ...state,
        isNicknameDuplicated: action.payload,
      };
    }
    case CheckAction.CHECK_CATEGORIES:
      return { ...state, isCategoriesSelected: action.payload.length > 0 };
    case CheckAction.CHECK_DIFFICULTY:
      return { ...state, isDifficultySelected: action.payload !== 0 };
    default:
      throw new Error();
  }
};
