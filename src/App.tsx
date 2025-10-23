import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import type { LottieRefCurrentProps } from 'lottie-react';
import campfireAnimation from './animations/campfire.json';
import './App.css';

/**
 * 焚き火に投げ込まれる紙切れのデータ型
 * ユーザーが入力したテキストがアニメーションで焚き火に飛んでいくときに使用
 */
interface PaperScrap {
  /** 紙切れを識別するユニークなID（タイムスタンプを使用） */
  id: string;
  /** 紙切れに表示されるテキスト内容 */
  text: string;
  /** テキストの長さに応じた強度（1〜3）、炎の大きさに影響 */
  intensity: number;
  /** アニメーション開始位置（テキスト入力欄の座標） */
  origin: { x: number; y: number };
  /** アニメーション終了位置（焚き火の座標） */
  target: { x: number; y: number };
}

export default function Campfire() {
  // ==================== State管理 ====================
  /** ユーザーが入力中のテキスト */
  const [text, setText] = useState('');
  /** 焚き火の炎の強さ（初期値: 20、上限なし） */
  const [flame, setFlame] = useState(20);
  /** 現在アニメーション中の紙切れの配列 */
  const [scraps, setScraps] = useState<PaperScrap[]>([]);
  /** ユーザーのモーション軽減設定（アクセシビリティ対応） */
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  /** 最後に炎が減衰した時刻（5分ごとに炎が減る仕組み） */
  const [lastDecayTime, setLastDecayTime] = useState(Date.now());

  // ==================== Ref管理 ====================
  /** 焚き火要素のDOM参照 */
  const campfireRef = useRef<HTMLDivElement>(null);
  /** Lottieアニメーションの制御用参照 */
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  /** 最後に送信したテキストを記録（連続送信防止用） */
  const lastSubmittedTextRef = useRef<string>('');
  /** IME（日本語入力など）で変換中かどうかを追跡するフラグ
   * 変換中はtrueになり、Enterキーでの送信を防ぐ */
  const isComposingRef = useRef(false);
  /** リングノート画像のDOM参照（紙切れの起点座標計算用） */
  const memoImageRef = useRef<HTMLImageElement>(null);
  /** textarea要素のDOM参照（iOS Safari対応: placeholder問題を解決するため） */
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ==================== ヘルパー関数 ====================
  /**
   * テキストの長さから強度を計算
   * @param textLength - テキストの文字数
   * @returns 1（小）、2（中）、3（大）のいずれか
   */
  const getIntensity = (textLength: number): number => {
    if (textLength < 20) return 1; // 短文: 強度1
    if (textLength < 80) return 2; // 中文: 強度2
    return 3; // 長文: 強度3
  };

  /**
   * 強度に応じた炎の上昇量を取得
   * @param intensity - 強度（1〜3）
   * @returns 炎に加算される値
   */
  const getFlameBoost = (intensity: number): number => {
    switch (intensity) {
      case 1:
        return 15; // 弱い炎の上昇
      case 2:
        return 25; // 中程度の炎の上昇
      case 3:
        return 35; // 強い炎の上昇
      default:
        return 15;
    }
  };

  // ==================== イベントハンドラ ====================
  /**
   * テキスト送信処理
   * ユーザーが「燃やす」ボタンを押すかEnterキーを押したときに実行される
   */
  const handleSubmit = () => {
    // 空のテキストは送信しない
    if (!text.trim()) return;

    const currentText = text.trim();

    // テキストの長さから強度を計算（1〜3）
    const intensity = getIntensity(currentText.length);
    // 強度に応じて炎を上昇させる（上限なし）
    const newFlame = flame + getFlameBoost(intensity);

    // 紙切れのアニメーション用の座標を計算
    const isMobile = window.innerWidth < 768;

    // リングノート画像の実際の位置を取得して起点とする
    let originY = window.innerHeight - 200; // デフォルト値
    if (memoImageRef.current) {
      const rect = memoImageRef.current.getBoundingClientRect();
      originY = rect.top + rect.height * 0.1; // 画像の上部（上から30%の位置）
    }

    const scrap: PaperScrap = {
      id: Date.now().toString(), // ユニークなIDを生成
      text:
        currentText.length > 140
          ? currentText.slice(0, 140) + '…' // 140文字で切り詰め
          : currentText,
      intensity,
      origin: {
        x: window.innerWidth / 2, // 画面中央
        y: originY, // リングノート画像の位置
      },
      target: {
        // デスクトップは右寄り（65%）、モバイルは中央
        x: isMobile ? window.innerWidth / 2 : window.innerWidth * 0.65,
        y: window.innerHeight * 0.8, // 焚き火の位置（画面下から80%）
      },
    };

    // テキストを即座にクリアして、アニメーションと炎の更新を開始
    setText('');
    setScraps((prev) => [...prev, scrap]); // 紙切れを追加
    setFlame(newFlame); // 炎を増加

    // iOS Safari対応: textareaを強制的にリセットしてplaceholder問題を解決
    if (textareaRef.current) {
      textareaRef.current.value = '';
      textareaRef.current.blur();
      // 次のフレームで再フォーカス（placeholderを完全にリセット）
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }

    // 3.2秒後に紙切れを削除（アニメーション完了後）
    setTimeout(() => {
      setScraps((prev) => prev.filter((s) => s.id !== scrap.id));
    }, 3200);

    // 0.5秒後に次の送信を許可（連続送信防止のクールダウン）
    setTimeout(() => {
      lastSubmittedTextRef.current = '';
    }, 500);
  };

  /**
   * Enterキーが押されたときの処理
   * 日本語入力中（IME変換中）でなければ、送信する
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // isComposingRef.current が true の場合は、日本語の変換確定中なので送信しない
    // false の場合のみ、Enterキーで送信処理を実行
    if (e.key === 'Enter' && !isComposingRef.current) {
      e.preventDefault(); // デフォルトの改行動作を防ぐ
      handleSubmit();
    }
  };

  /**
   * IME（日本語入力など）の変換が開始されたときに呼ばれる
   * 例: 「あ」と入力して変換候補が表示されたとき
   */
  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  /**
   * IME（日本語入力など）の変換が終了したときに呼ばれる
   * 例: 変換候補から「愛」を選んでEnterで確定したとき
   */
  const handleCompositionEnd = () => {
    isComposingRef.current = false;
  };

  /**
   * textareaがフォーカスされたときに呼ばれる
   * iOS Safari対応: スクロール位置を強制的にリセット
   */
  const handleFocus = () => {
    // スクロール位置を強制的に(0, 0)に戻す
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  /**
   * textareaからフォーカスが外れたときに呼ばれる
   * iOS Safari対応: スクロール位置を確実にリセット
   */
  const handleBlur = () => {
    // スクロール位置を強制的に(0, 0)に戻す
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  // ==================== useEffect（副作用フック） ====================
  /**
   * iOS Safari対応: スクロールを完全に防止
   * ページ全体のスクロールを無効化し、位置を(0, 0)に固定
   */
  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault();
      window.scrollTo(0, 0);
    };

    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
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

  /**
   * ユーザーのモーション軽減設定を監視
   * アクセシビリティ対応: 動きに敏感なユーザーのためにアニメーションを軽減
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // 設定が変更されたときに再チェック
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  /**
   * 5分ごとの炎減衰システム
   * 何も燃やさないと徐々に炎が弱くなっていく仕組み
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastDecayTime;
      const fiveMinutes = 5 * 60 * 1000; // 5分（ミリ秒）

      // 5分が経過したかチェック
      if (elapsed >= fiveMinutes) {
        setFlame((prev) => {
          // 現在の炎の強さの20%を減衰（最低5減る）
          const decayAmount = Math.max(prev * 0.2, 5);
          // 炎は最低10まで減る（完全には消えない）
          return Math.max(10, prev - decayAmount);
        });
        setLastDecayTime(now); // 減衰時刻を更新
      }
    }, 1000); // 毎秒チェック

    return () => clearInterval(interval); // クリーンアップ
  }, [lastDecayTime]);

  /**
   * 炎の強さに応じてLottieアニメーションの速度を制御
   * 炎が強いほどアニメーションが速くなる
   */
  useEffect(() => {
    if (lottieRef.current) {
      const baseSpeed = 1; // 基本速度
      const speedMultiplier = 0.5 + (flame / 100) * 1.5; // 0.5倍〜2倍の範囲
      lottieRef.current.setSpeed(baseSpeed * speedMultiplier);
    }
  }, [flame]);

  // ==================== 計算値 ====================
  /** 炎の強さに応じたスケール（拡大率） */
  const flameScale = 0.8 + (flame / 100) * 1.2;
  /** 炎の強さに応じた不透明度 */
  const flameOpacity = 0.8 + (flame / 100) * 0.2;
  /** 星の数（モーション軽減設定に応じて調整） */
  const starCount = prefersReducedMotion ? 50 : 150;

  return (
    <>
      <div className="h-[100dvh] w-full relative overflow-hidden bg-gradient-to-b from-[#0a0a15] via-[#0d0d1a] to-[#050508]">
        {/* CSS星空背景 */}
        <div className="absolute inset-0 opacity-60">
          {Array.from({ length: starCount }).map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 70}%`,
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                animationDuration: `${2 + Math.random() * 3}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* 焚き火の輝き */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: '50%',
            top: '80%',
            transform: 'translate(-50%, -50%)',
            width: `${400 + (flame / 100) * 300}px`,
            height: `${400 + (flame / 100) * 300}px`,
            background: `radial-gradient(circle, rgba(255,120,20,${
              0.3 + (flame / 100) * 0.2
            }) 0%, rgba(255,90,10,${
              0.2 + (flame / 100) * 0.1
            }) 25%, rgba(200,60,10,${
              0.1 + (flame / 100) * 0.05
            }) 50%, transparent 70%)`,
            filter: 'blur(40px)',
          }}
        />

        {/* メインコンテンツ */}
        <div className="relative z-10 min-h-screen">
          {/* デスクトップ焚き火 - 左から65%、上から80%の位置に配置してキャンバスの輝きと一致 */}
          <div
            ref={campfireRef}
            className="absolute hidden md:block"
            style={{
              left: '65%',
              top: '80%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="relative">
              {/* Lottie炎アニメーション */}
              <motion.div
                className="campfire-flame-container absolute left-1/2 transform -translate-x-1/2"
                style={{
                  bottom: '0px',
                  width: `${100 + (flame / 100) * 150}px`,
                  height: `${Math.min(120 + (flame / 100) * 180, 400)}px`,
                  maxHeight: '400px',
                }}
                animate={{
                  scale: flameScale,
                  opacity: flameOpacity,
                }}
                transition={{
                  scale: { duration: 0.8 },
                  opacity: { duration: 0.8 },
                }}
              >
                <Lottie
                  lottieRef={lottieRef}
                  animationData={campfireAnimation}
                  loop={true}
                  autoplay={true}
                  style={{
                    width: '100%',
                    height: '100%',
                    filter: `brightness(${0.8 + flame / 200}) saturate(${
                      1 + flame / 200
                    })`,
                  }}
                />
              </motion.div>
            </div>
          </div>

          {/* モバイル焚き火 - 中央、上から80%の位置に配置してキャンバスの輝きと一致 */}
          <div
            className="md:hidden absolute z-10"
            style={{
              left: '50%',
              top: '80%',
              transform: 'translate(-50%, -50%) scale(0.7)',
            }}
          >
            {/* モバイル用Lottie炎 */}
            <div className="relative">
              <motion.div
                className="campfire-flame-container absolute left-1/2 transform -translate-x-1/2"
                style={{
                  bottom: '0px',
                  width: `${100 + (flame / 100) * 150}px`,
                  height: `${Math.min(120 + (flame / 100) * 180, 350)}px`,
                  maxHeight: '350px',
                }}
                animate={{
                  scale: flameScale,
                  opacity: flameOpacity,
                }}
                transition={{
                  scale: { duration: 0.8 },
                  opacity: { duration: 0.8 },
                }}
              >
                <Lottie
                  animationData={campfireAnimation}
                  loop={true}
                  autoplay={true}
                  style={{
                    width: '100%',
                    height: '100%',
                    filter: `brightness(${0.8 + flame / 200}) saturate(${
                      1 + flame / 200
                    })`,
                  }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* 紙のスクラップアニメーション - ノートからちぎれた紙 */}
      {scraps.map((scrap) => (
        <motion.div
          key={scrap.id}
          className="fixed pointer-events-none z-[200]"
          style={{
            left: 0,
            top: 0,
          }}
          initial={{
            x: scrap.origin.x - 100,
            y: scrap.origin.y - 50,
            scale: 1,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            x: scrap.target.x - 100,
            y: scrap.target.y - 50,
            scale: 0.2,
            rotate: 720,
            opacity: 0,
          }}
          transition={{
            duration: 4,
            ease: [0.4, 0.0, 0.2, 1],
          }}
        >
          {/* ノートからちぎれた紙のデザイン */}
          <div className="paper-scrap relative p-4 text-gray-800 text-base font-medium overflow-hidden">
            {scrap.text}
          </div>
        </motion.div>
      ))}

      {/* パネルの浮遊するジャーナル - 中央固定配置 */}
      <div
        className="fixed w-[calc(100%-2rem)] md:w-[600px] lg:w-[700px] max-w-[700px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 space-y-4"
        style={{
          zIndex: 100,
        }}
      >
        {/* テキスト入力 - リングノート風デザイン */}
        <div className="w-full flex justify-center">
          {/* リングノート背景とテキスト入力を重ねたコンテナ */}
          <div className="relative w-full max-w-md md:max-w-lg">
            {/* リングノート背景画像（imgタグでアスペクト比を保持） */}
            <img
              ref={memoImageRef}
              src="/memo.png"
              alt="リングノート"
              className="w-full h-auto"
              style={{
                opacity: 0.95,
                filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))',
              }}
            />

            {/* テキスト入力欄（ノートの紙の部分に配置） */}
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              // 日本語入力の変換開始・終了を検知するイベント
              // これにより「変換確定のEnter」と「送信のEnter」を区別できる
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              // iOS Safari対応: フォーカス時/ブラー時のスクロール防止
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="頭に思い浮かぶもやもやを書こう。確定ボタンで焚き火に投げ込めるよ。"
              rows={4}
              className="absolute z-10 top-[30%] left-[10%] w-[80%] text-gray-800 placeholder:text-gray-400 focus:outline-none leading-relaxed font-medium bg-transparent border-none resize-none"
              style={{
                fontFamily: '"Klee One", cursive, sans-serif',
                // iOS対応: 16px未満だとズームが発生するため、最小16pxを確保
                fontSize: 'max(16px, min(4vw, 36px))',
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
