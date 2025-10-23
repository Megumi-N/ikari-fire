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
      const decayAmount = Math.max(prev * FLAME_CONFIG.DECAY_RATE, FLAME_CONFIG.MIN_DECAY);
      return Math.max(FLAME_CONFIG.MIN, prev - decayAmount);
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
