import { atom } from "recoil";

export const selectedRankingState = atom<"point" | "read">({
  key: "selectedRankingState", // 상태를 고유하게 식별할 수 있는 키
  default: "point",
});
