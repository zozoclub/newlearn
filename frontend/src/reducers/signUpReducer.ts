import {
  SignUpAction,
  SignUpActionObject,
  SignUpStateType,
} from "types/signUpType";

export const initialSignUpState: SignUpStateType = {
  email: "",
  name: "",
  provider: "",
  providerId: "",
  nickname: "",
  difficulty: 0,
  categories: [],
  skin: 0,
  eyes: 0,
  mask: 0,
};

export const signUpReducer = (
  state: SignUpStateType,
  action: SignUpActionObject
): SignUpStateType => {
  switch (action.type) {
    case SignUpAction.CHANGE_NICKNAME:
      return { ...state, nickname: action.payload };
    case SignUpAction.CHANGE_CATEGORIES:
      return {
        ...state,
        categories: state.categories.includes(action.payload)
          ? state.categories.filter(
              (categoryName) => categoryName !== action.payload
            )
          : state.categories.length < 3
          ? [...state.categories, action.payload]
          : state.categories,
      };
    case SignUpAction.CHANGE_DIFFICULTY:
      return { ...state, difficulty: action.payload };
    case SignUpAction.CHANGE_AVATAR:
      return {
        ...state,
        skin: action.payload.skin,
        eyes: action.payload.eyes,
        mask: action.payload.mask,
      };
    case SignUpAction.SET_OAUTH_INFORMATION:
      return {
        ...state,
        email: action.payload.email,
        name: action.payload.name,
        provider: action.payload.provider,
        providerId: action.payload.providerId,
      };
    default:
      throw new Error();
  }
};
