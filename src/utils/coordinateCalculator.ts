import { LAYOUT_CONFIG } from '../constants';
import type { Coordinates } from '../types';

/**
 * 紙切れアニメーションの座標を計算するユーティリティ
 */
export class CoordinateCalculator {
  /**
   * 紙切れの起点座標（リングノート画像の位置）を計算
   */
  static calculateOrigin(memoImageRef: React.RefObject<HTMLImageElement | null>): Coordinates {
    let originY = window.innerHeight - 200; // デフォルト値

    if (memoImageRef.current) {
      const rect = memoImageRef.current.getBoundingClientRect();
      originY = rect.top + rect.height * LAYOUT_CONFIG.MEMO_ORIGIN_OFFSET;
    }

    return {
      x: window.innerWidth / 2,
      y: originY,
    };
  }

  /**
   * 紙切れの目標座標（焚き火の位置）を計算
   */
  static calculateTarget(): Coordinates {
    const isMobile = window.innerWidth < LAYOUT_CONFIG.MOBILE_BREAKPOINT;

    return {
      x: isMobile
        ? window.innerWidth / 2
        : (window.innerWidth * LAYOUT_CONFIG.CAMPFIRE_X_DESKTOP) / 100,
      y: (window.innerHeight * LAYOUT_CONFIG.CAMPFIRE_Y) / 100,
    };
  }
}
