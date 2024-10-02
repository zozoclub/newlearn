import { atom } from "recoil";

export type ExpType = {
  isOpen: boolean;
  experience: number;
  action: string;
};

export const isExpModalState = atom<ExpType>({
  key: "expModal", // 상태를 고유하게 식별할 수 있는 키
  default: {
    isOpen: false,
    experience: 0,
    action: "",
  },
});
