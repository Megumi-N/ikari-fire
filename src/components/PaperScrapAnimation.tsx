import { motion } from 'framer-motion';
import type { PaperScrap } from '../types';

interface PaperScrapAnimationProps {
  scraps: PaperScrap[];
}

/**
 * 紙切れのアニメーションコンポーネント
 * ノートから焚き火へ飛んでいく紙切れを表示
 */
export const PaperScrapAnimation: React.FC<PaperScrapAnimationProps> = ({
  scraps,
}) => {
  return (
    <>
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
          role="img"
          aria-label={`もやもやを焚き火に投げ込んでいます: ${scrap.text}`}
        >
          {/* ノートからちぎれた紙のデザイン */}
          <div className="paper-scrap relative p-4 text-gray-800 text-base font-medium overflow-hidden">
            {scrap.text}
          </div>
        </motion.div>
      ))}
    </>
  );
};
