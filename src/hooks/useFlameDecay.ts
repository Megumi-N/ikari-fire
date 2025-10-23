import { useEffect } from 'react';
import { FLAME_CONFIG } from '../constants';

/**
 * 炎の減衰システムを管理するカスタムフック
 * DECAY_INTERVAL、何も投げ込まないと1ランク火力が下がり、
 * 放置すると初期値まで戻る
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
