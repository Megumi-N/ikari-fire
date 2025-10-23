import { useEffect } from 'react';
import type { LottieRefCurrentProps } from 'lottie-react';
import { calculateFlameSpeed } from '../constants';

/**
 * Lottieアニメーションの速度を炎の強さに応じて制御するカスタムフック
 */
export const useFlameAnimation = (
  lottieRef: React.RefObject<LottieRefCurrentProps | null>,
  flame: number
) => {
  useEffect(() => {
    if (lottieRef.current) {
      const speed = calculateFlameSpeed(flame);
      lottieRef.current.setSpeed(speed);
    }
  }, [flame, lottieRef]);
};
