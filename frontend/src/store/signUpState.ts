import { atom, DefaultValue, selector } from "recoil";
import { SignUpStateType } from "types/signUpType";

export const signUpState = atom<SignUpStateType>({
  key: "signUpState",
  default: {
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
  },
});

export const nicknameState = selector({
  key: "nicknameState",
  get: ({ get }) => get(signUpState).nickname,
  set: ({ set }, newValue) =>
    set(signUpState, (prevState) => ({
      ...prevState,
      nickname: newValue as string,
    })),
});

export const categoriesState = selector({
  key: "categoriesState",
  get: ({ get }) => get(signUpState).categories,
  set: ({ set }, newValue) =>
    set(signUpState, (prevState) => ({
      ...prevState,
      categories: newValue as string[],
    })),
});

export const difficultyState = selector({
  key: "difficultyState",
  get: ({ get }) => get(signUpState).difficulty,
  set: ({ set }, newValue) =>
    set(signUpState, (prevState) => ({
      ...prevState,
      difficulty: newValue as number,
    })),
});

export const avatarState = selector({
  key: "avatarState",
  get: ({ get }) => {
    const state = get(signUpState);
    return {
      skin: state.skin,
      eyes: state.eyes,
      mask: state.mask,
    };
  },
  set: ({ set }, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      set(signUpState, (prevState) => ({
        ...prevState,
        skin: newValue.skin,
        eyes: newValue.eyes,
        mask: newValue.mask,
      }));
    }
  },
});

export const oAuthInfoState = selector({
  key: "oAuthInfoState",
  get: ({ get }) => {
    const state = get(signUpState);
    return {
      email: state.email,
      name: state.name,
      provider: state.provider,
      providerId: state.providerId,
    };
  },
  set: ({ set }, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      set(signUpState, (prevState) => ({
        ...prevState,
        email: newValue.email,
        name: newValue.name,
        provider: newValue.provider,
        providerId: newValue.providerId,
      }));
    }
  },
});

export const checkState = selector({
  key: "checkState",
  get: ({ get }) => {
    const state = get(signUpState);

    // 기존의 유효성 검사
    const isNicknameAvailable = /^[가-힣ㄱ-ㅎㅏ-ㅣ]{3,8}$/.test(state.nickname);
    const isDifficultySelected = state.difficulty > 0;
    const isCategoriesSelected = state.categories.length > 0;

    return {
      isNicknameAvailable,
      isDifficultySelected,
      isCategoriesSelected,
    };
  },
});

export const nicknameDupState = atom<boolean>({
  key: "nicknameDupState",
  default: false,
});
