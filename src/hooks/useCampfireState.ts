import { useState, useRef, useCallback } from 'react';
import type { LottieRefCurrentProps } from 'lottie-react';
import type { PaperScrap } from '../types';
import { FLAME_CONFIG } from '../constants';

/**
 * 焚き火の状態管理を行うカスタムフック
 * 複数のuseStateを統合し、状態管理を一元化
 */
export const useCampfireState = () => {
  // ==================== State管理 ====================
  const [text, setText] = useState<string>('');
  const [flame, setFlame] = useState<number>(FLAME_CONFIG.INITIAL);
  const [scraps, setScraps] = useState<PaperScrap[]>([]);
  const [lastDecayTime, setLastDecayTime] = useState<number>(Date.now());

  // ==================== Ref管理 ====================
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const memoImageRef = useRef<HTMLImageElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isComposingRef = useRef(false);

  // ==================== コールバック ====================
  const addScrap = useCallback((scrap: PaperScrap) => {
    setScraps((prev) => [...prev, scrap]);
  }, []);

  const removeScrap = useCallback((id: string) => {
    setScraps((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const increaseFlame = useCallback((amount: number) => {
    setFlame((prev) => prev + amount);
  }, []);

  const decayFlame = useCallback(() => {
    setFlame((prev) => {
      // 初期値より大きい場合のみ減衰
      if (prev > FLAME_CONFIG.TARGET) {
        // 1ランク（RANK_STEP）ずつ減少
        const newFlame = prev - FLAME_CONFIG.RANK_STEP;
        // 初期値を下回らないようにする
        return Math.max(FLAME_CONFIG.TARGET, newFlame);
      }
      // 初期値以下の場合は減衰しない
      return prev;
    });
    setLastDecayTime(Date.now());
  }, []);

  return {
    // State
    text,
    setText,
    flame,
    scraps,
    lastDecayTime,

    // Refs
    lottieRef,
    memoImageRef,
    textareaRef,
    isComposingRef,

    // Actions
    addScrap,
    removeScrap,
    increaseFlame,
    decayFlame,
  };
};
