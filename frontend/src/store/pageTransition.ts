import { atom } from 'recoil';

export const pageTransitionState = atom({
  key: 'pageTransitionState', // Recoil atom의 고유 키
  default: { isTransitioning: false, targetLocation: '' }, // 초기 상태
});
