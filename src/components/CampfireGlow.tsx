import { calculateGlowSize, GLOW_CONFIG, LAYOUT_CONFIG } from '../constants';

interface CampfireGlowProps {
  flame: number;
  isMobile?: boolean;
}

/**
 * 焚き火の輝きエフェクトコンポーネント
 * 炎の強さに応じて輝きのサイズと不透明度を変化させる
 */
export const CampfireGlow: React.FC<CampfireGlowProps> = ({
  flame,
  isMobile = false,
}) => {
  const size = calculateGlowSize(flame);
  const opacity1 = GLOW_CONFIG.BASE_OPACITY + (flame / 100) * GLOW_CONFIG.OPACITY_MULTIPLIER;
  const opacity2 = (GLOW_CONFIG.BASE_OPACITY + (flame / 100) * GLOW_CONFIG.OPACITY_MULTIPLIER) * 0.67;
  const opacity3 = (GLOW_CONFIG.BASE_OPACITY + (flame / 100) * GLOW_CONFIG.OPACITY_MULTIPLIER) * 0.5;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: isMobile ? '50%' : `${LAYOUT_CONFIG.CAMPFIRE_X_DESKTOP}%`,
        top: `${LAYOUT_CONFIG.CAMPFIRE_Y}%`,
        transform: 'translate(-50%, -50%)',
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle, rgba(255,120,20,${opacity1}) 0%, rgba(255,90,10,${opacity2}) 25%, rgba(200,60,10,${opacity3}) 50%, transparent 70%)`,
        filter: `blur(${GLOW_CONFIG.BLUR_RADIUS}px)`,
      }}
    />
  );
};
