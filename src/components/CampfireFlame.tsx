import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import type { LottieRefCurrentProps } from 'lottie-react';
import campfireAnimation from '../animations/campfire.json';
import {
  calculateFlameScale,
  calculateFlameOpacity,
  calculateLottieWidth,
  calculateLottieHeight,
  calculateBrightness,
  calculateSaturation,
  ANIMATION_CONFIG,
} from '../constants';

interface CampfireFlameProps {
  flame: number;
  lottieRef?: React.RefObject<LottieRefCurrentProps | null>;
  isMobile?: boolean;
}

/**
 * 焚き火の炎のLottieアニメーションコンポーネント
 * デスクトップとモバイルで共通化し、DRY原則を適用
 */
export const CampfireFlame: React.FC<CampfireFlameProps> = ({
  flame,
  lottieRef,
  isMobile = false,
}) => {
  const flameScale = calculateFlameScale(flame);
  const flameOpacity = calculateFlameOpacity(flame);
  const width = calculateLottieWidth(flame);
  const height = calculateLottieHeight(flame, isMobile);
  const brightness = calculateBrightness(flame);
  const saturation = calculateSaturation(flame);

  return (
    <motion.div
      className="campfire-flame-container absolute left-1/2 transform -translate-x-1/2"
      style={{
        bottom: '0px',
        width: `${width}px`,
        height: `${height}px`,
        maxHeight: `${height}px`,
      }}
      animate={{
        scale: flameScale,
        opacity: flameOpacity,
      }}
      transition={{
        scale: { duration: ANIMATION_CONFIG.FLAME_TRANSITION_DURATION },
        opacity: { duration: ANIMATION_CONFIG.FLAME_TRANSITION_DURATION },
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
          filter: `brightness(${brightness}) saturate(${saturation})`,
        }}
      />
    </motion.div>
  );
};
