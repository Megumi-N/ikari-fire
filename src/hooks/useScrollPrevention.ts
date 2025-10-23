import { useEffect, useCallback } from 'react';

/**
 * スクロール位置をリセットする関数
 * iOS Safari対応: 複数箇所でスクロールをリセット
 */
const resetScroll = () => {
  window.scrollTo(0, 0);
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
};

/**
 * スクロールを防止するカスタムフック
 * iOS Safari対応: スクロールイベントを完全に防止
 */
export const useScrollPrevention = () => {
  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault();
      resetScroll();
    };

    // 各種スクロールイベントを監視して防止
    window.addEventListener('scroll', resetScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('scroll', resetScroll, { passive: false });

    // 初期表示時にも確実に(0, 0)にリセット
    resetScroll();

    return () => {
      window.removeEventListener('scroll', resetScroll);
      window.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('scroll', resetScroll);
    };
  }, []);

  // コンポーネントで使用できるようにresetScrollを返す
  return useCallback(resetScroll, []);
};
