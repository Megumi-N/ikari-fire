import { useMemo } from 'react';
import { CampfireFlame } from './components/CampfireFlame';
import { CampfireGlow } from './components/CampfireGlow';
import { PaperScrapAnimation } from './components/PaperScrapAnimation';
import { MemoInput } from './components/MemoInput';
import { useCampfireState } from './hooks/useCampfireState';
import { useFlameDecay } from './hooks/useFlameDecay';
import { useFlameAnimation } from './hooks/useFlameAnimation';
import { useScrollPrevention } from './hooks/useScrollPrevention';
import { CoordinateCalculator } from './utils/coordinateCalculator';
import {
  getIntensity,
  getFlameBoost,
  INTENSITY_CONFIG,
  ANIMATION_CONFIG,
  LAYOUT_CONFIG,
} from './constants';
import type { PaperScrap } from './types';

export default function Campfire() {
  // ==================== カスタムフックで状態管理 ====================
  const {
    text,
    setText,
    flame,
    scraps,
    lastDecayTime,
    lottieRef,
    memoImageRef,
    textareaRef,
    isComposingRef,
    addScrap,
    removeScrap,
    increaseFlame,
    decayFlame,
  } = useCampfireState();

  const resetScroll = useScrollPrevention();

  // 炎の減衰とアニメーション速度の制御
  useFlameDecay(lastDecayTime, decayFlame);
  useFlameAnimation(lottieRef, flame);

  // ==================== イベントハンドラ ====================
  /**
   * テキスト送信処理
   * ユーザーがEnterキーを押したときに実行される
   */
  const handleSubmit = () => {
    // 空のテキストは送信しない
    if (!text.trim()) return;

    const currentText = text.trim();

    // テキストの長さから強度を計算（1〜3）
    const intensity = getIntensity(currentText.length);
    // 強度に応じて炎を上昇させる
    const flameBoost = getFlameBoost(intensity);

    // 紙切れのアニメーション用の座標を計算
    const origin = CoordinateCalculator.calculateOrigin(memoImageRef);
    const target = CoordinateCalculator.calculateTarget();

    const scrap: PaperScrap = {
      id: Date.now().toString(),
      text:
        currentText.length > INTENSITY_CONFIG.MAX_DISPLAY_LENGTH
          ? currentText.slice(0, INTENSITY_CONFIG.MAX_DISPLAY_LENGTH) + '…'
          : currentText,
      intensity,
      origin,
      target,
    };

    // テキストを即座にクリアして、アニメーションと炎の更新を開始
    setText('');
    addScrap(scrap);
    increaseFlame(flameBoost);

    // iOS Safari対応: textareaを強制的にリセットしてplaceholder問題を解決
    if (textareaRef.current) {
      textareaRef.current.value = '';
      textareaRef.current.blur();
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }

    // アニメーション完了後に紙切れを削除
    setTimeout(() => {
      removeScrap(scrap.id);
    }, ANIMATION_CONFIG.PAPER_REMOVAL_DELAY);
  };

  /**
   * Enterキーが押されたときの処理
   * 日本語入力中（IME変換中）でなければ、送信する
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isComposingRef.current) {
      e.preventDefault();
      handleSubmit();
    }
  };

  /**
   * IME（日本語入力など）の変換が開始/終了したときに呼ばれる
   */
  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = () => {
    isComposingRef.current = false;
  };

  /**
   * textareaがフォーカス/ブラーしたときにスクロールをリセット
   * iOS Safari対応
   */
  const handleScrollReset = resetScroll;

  // isMobileをuseMemoでメモ化（レンダー毎の再計算を防ぐ）
  const isMobile = useMemo(
    () => window.innerWidth < LAYOUT_CONFIG.MOBILE_BREAKPOINT,
    []
  );

  return (
    <>
      <div
        className="h-[100dvh] w-full relative overflow-hidden bg-gradient-to-b from-[#0a0a15] via-[#0d0d1a] to-[#050508]"
        role="main"
        aria-label="焚き火アプリケーション"
      >
        {/* 焚き火の輝き */}
        <CampfireGlow flame={flame} isMobile={isMobile} />

        {/* メインコンテンツ */}
        <div className="relative z-10 min-h-screen">
          {/* デスクトップ焚き火 */}
          <div
            className="absolute hidden md:block"
            style={{
              left: `${LAYOUT_CONFIG.CAMPFIRE_X_DESKTOP}%`,
              top: `${LAYOUT_CONFIG.CAMPFIRE_Y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            role="img"
            aria-label={`焚き火の炎 - 強さ: ${Math.round(flame)}`}
          >
            <CampfireFlame flame={flame} lottieRef={lottieRef} />
          </div>

          {/* モバイル焚き火 */}
          <div
            className="md:hidden absolute z-10"
            style={{
              left: '50%',
              top: `${LAYOUT_CONFIG.CAMPFIRE_Y}%`,
              transform: `translate(-50%, -50%) scale(${LAYOUT_CONFIG.CAMPFIRE_SCALE_MOBILE})`,
            }}
            role="img"
            aria-label={`焚き火の炎 - 強さ: ${Math.round(flame)}`}
          >
            <CampfireFlame flame={flame} isMobile />
          </div>
        </div>
      </div>

      {/* 紙のスクラップアニメーション */}
      <PaperScrapAnimation scraps={scraps} />

      {/* メモ入力 */}
      <MemoInput
        text={text}
        onTextChange={setText}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onFocus={handleScrollReset}
        onBlur={handleScrollReset}
        memoImageRef={memoImageRef}
        textareaRef={textareaRef}
      />
    </>
  );
}
