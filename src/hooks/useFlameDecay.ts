import { useEffect } from 'react';
import { FLAME_CONFIG } from '../constants';

/**
 * 炎の減衰システムを管理するカスタムフック
 * 5分ごとに炎が自動的に減衰する
 */
export const useFlameDecay = (
  lastDecayTime: number,
  decayFlame: () => void
) => {
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastDecayTime;

      if (elapsed >= FLAME_CONFIG.DECAY_INTERVAL) {
        decayFlame();
      }
    }, 1000); // 毎秒チェック

    return () => clearInterval(interval);
  }, [lastDecayTime, decayFlame]);
};
