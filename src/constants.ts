/**
 * アプリケーション全体で使用される定数
 * DRY原則に従い、マジックナンバーと設定値を一元管理
 */

// ==================== 炎の設定 ====================
export const FLAME_CONFIG = {
  /** 炎の初期値 */
  INITIAL: 20,
  /** 炎の最小値（完全には消えない） */
  MIN: 10,
  /** 炎の減衰間隔（ミリ秒） */
  DECAY_INTERVAL: 5 * 60 * 1000, // 5分
  /** 炎の減衰率（現在の値の20%） */
  DECAY_RATE: 0.2,
  /** 炎の最小減衰量 */
  MIN_DECAY: 5,
  /** 炎の速度の基本倍率 */
  SPEED_BASE: 1,
  /** 炎の速度の最小倍率 */
  SPEED_MIN: 0.5,
  /** 炎の速度の最大倍率 */
  SPEED_MAX: 2,
  /** 炎のスケールの基本値 */
  SCALE_BASE: 0.8,
  /** 炎のスケールの倍率 */
  SCALE_MULTIPLIER: 1.2,
  /** 炎の不透明度の基本値 */
  OPACITY_BASE: 0.8,
  /** 炎の不透明度の倍率 */
  OPACITY_MULTIPLIER: 0.2,
} as const;

// ==================== テキスト強度の設定 ====================
export const INTENSITY_CONFIG = {
  /** 短文の閾値（文字数） */
  SHORT_TEXT_THRESHOLD: 20,
  /** 中文の閾値（文字数） */
  MEDIUM_TEXT_THRESHOLD: 80,
  /** 最大表示文字数 */
  MAX_DISPLAY_LENGTH: 140,
  /** 強度1（短文）の炎上昇量 */
  BOOST_LOW: 15,
  /** 強度2（中文）の炎上昇量 */
  BOOST_MEDIUM: 25,
  /** 強度3（長文）の炎上昇量 */
  BOOST_HIGH: 35,
} as const;

// ==================== アニメーション設定 ====================
export const ANIMATION_CONFIG = {
  /** 紙切れのアニメーション時間（ミリ秒） */
  PAPER_FLIGHT_DURATION: 4000,
  /** 紙切れの削除タイミング（ミリ秒） */
  PAPER_REMOVAL_DELAY: 3200,
  /** 連続送信防止のクールダウン時間（ミリ秒） */
  SUBMIT_COOL_DOWN: 500,
  /** 炎のアニメーション時間（秒） */
  FLAME_TRANSITION_DURATION: 0.8,
} as const;

// ==================== レイアウト設定 ====================
export const LAYOUT_CONFIG = {
  /** デスクトップの焚き火の水平位置（%） */
  CAMPFIRE_X_DESKTOP: 65,
  /** 焚き火の垂直位置（%） */
  CAMPFIRE_Y: 80,
  /** モバイルの焚き火のスケール */
  CAMPFIRE_SCALE_MOBILE: 0.7,
  /** テキスト入力欄の上部位置（%） */
  TEXTAREA_TOP: 30,
  /** テキスト入力欄の左右マージン（%） */
  TEXTAREA_MARGIN: 10,
  /** リングノート画像の起点位置（画像高さに対する%） */
  MEMO_ORIGIN_OFFSET: 0.1,
  /** モバイルの閾値（px） */
  MOBILE_BREAKPOINT: 768,
} as const;

// ==================== 焚き火の輝き設定 ====================
export const GLOW_CONFIG = {
  /** 輝きの基本サイズ */
  BASE_SIZE: 400,
  /** 輝きのサイズ倍率 */
  SIZE_MULTIPLIER: 300,
  /** 輝きの基本不透明度 */
  BASE_OPACITY: 0.3,
  /** 輝きの不透明度倍率 */
  OPACITY_MULTIPLIER: 0.2,
  /** 輝きのぼかし量（px） */
  BLUR_RADIUS: 40,
} as const;

// ==================== Lottieアニメーション設定 ====================
export const LOTTIE_CONFIG = {
  /** 炎の基本幅 */
  FLAME_BASE_WIDTH: 100,
  /** 炎の幅の増加量 */
  FLAME_WIDTH_INCREASE: 150,
  /** 炎の基本高さ */
  FLAME_BASE_HEIGHT: 120,
  /** 炎の高さの増加量 */
  FLAME_HEIGHT_INCREASE: 180,
  /** 炎の最大高さ（デスクトップ） */
  FLAME_MAX_HEIGHT_DESKTOP: 400,
  /** 炎の最大高さ（モバイル） */
  FLAME_MAX_HEIGHT_MOBILE: 350,
  /** 炎の明るさの基本値 */
  BRIGHTNESS_BASE: 0.8,
  /** 炎の明るさの倍率 */
  BRIGHTNESS_MULTIPLIER: 200,
  /** 炎の彩度の基本値 */
  SATURATION_BASE: 1,
  /** 炎の彩度の倍率 */
  SATURATION_MULTIPLIER: 200,
} as const;

// ==================== ヘルパー関数 ====================
/**
 * テキストの長さから強度を計算
 */
export const getIntensity = (textLength: number): 1 | 2 | 3 => {
  if (textLength < INTENSITY_CONFIG.SHORT_TEXT_THRESHOLD) return 1;
  if (textLength < INTENSITY_CONFIG.MEDIUM_TEXT_THRESHOLD) return 2;
  return 3;
};

/**
 * 強度に応じた炎の上昇量を取得
 */
export const getFlameBoost = (intensity: 1 | 2 | 3): number => {
  switch (intensity) {
    case 1:
      return INTENSITY_CONFIG.BOOST_LOW;
    case 2:
      return INTENSITY_CONFIG.BOOST_MEDIUM;
    case 3:
      return INTENSITY_CONFIG.BOOST_HIGH;
  }
};

/**
 * 炎の強さから速度倍率を計算
 */
export const calculateFlameSpeed = (flame: number): number => {
  return (
    FLAME_CONFIG.SPEED_MIN +
    (flame / 100) * (FLAME_CONFIG.SPEED_MAX - FLAME_CONFIG.SPEED_MIN)
  );
};

/**
 * 炎の強さからスケールを計算
 */
export const calculateFlameScale = (flame: number): number => {
  return FLAME_CONFIG.SCALE_BASE + (flame / 100) * FLAME_CONFIG.SCALE_MULTIPLIER;
};

/**
 * 炎の強さから不透明度を計算
 */
export const calculateFlameOpacity = (flame: number): number => {
  return (
    FLAME_CONFIG.OPACITY_BASE + (flame / 100) * FLAME_CONFIG.OPACITY_MULTIPLIER
  );
};

/**
 * 炎の強さから輝きのサイズを計算
 */
export const calculateGlowSize = (flame: number): number => {
  return GLOW_CONFIG.BASE_SIZE + (flame / 100) * GLOW_CONFIG.SIZE_MULTIPLIER;
};

/**
 * 炎の強さからLottieの幅を計算
 */
export const calculateLottieWidth = (flame: number): number => {
  return LOTTIE_CONFIG.FLAME_BASE_WIDTH + (flame / 100) * LOTTIE_CONFIG.FLAME_WIDTH_INCREASE;
};

/**
 * 炎の強さからLottieの高さを計算
 */
export const calculateLottieHeight = (flame: number, isMobile: boolean): number => {
  const maxHeight = isMobile
    ? LOTTIE_CONFIG.FLAME_MAX_HEIGHT_MOBILE
    : LOTTIE_CONFIG.FLAME_MAX_HEIGHT_DESKTOP;
  return Math.min(
    LOTTIE_CONFIG.FLAME_BASE_HEIGHT + (flame / 100) * LOTTIE_CONFIG.FLAME_HEIGHT_INCREASE,
    maxHeight
  );
};

/**
 * 炎の強さから明るさフィルターを計算
 */
export const calculateBrightness = (flame: number): number => {
  return LOTTIE_CONFIG.BRIGHTNESS_BASE + flame / LOTTIE_CONFIG.BRIGHTNESS_MULTIPLIER;
};

/**
 * 炎の強さから彩度フィルターを計算
 */
export const calculateSaturation = (flame: number): number => {
  return LOTTIE_CONFIG.SATURATION_BASE + flame / LOTTIE_CONFIG.SATURATION_MULTIPLIER;
};
