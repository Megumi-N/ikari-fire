import { LAYOUT_CONFIG } from '../constants';

interface MemoInputProps {
  text: string;
  onTextChange: (text: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onCompositionStart: () => void;
  onCompositionEnd: () => void;
  onFocus: () => void;
  onBlur: () => void;
  memoImageRef: React.RefObject<HTMLImageElement | null>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

/**
 * リングノート風のメモ入力コンポーネント
 * アクセシビリティ対応: セマンティックHTML、ARIA属性、キーボード操作
 */
export const MemoInput: React.FC<MemoInputProps> = ({
  text,
  onTextChange,
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
  onFocus,
  onBlur,
  memoImageRef,
  textareaRef,
}) => {
  return (
    <div
      className="fixed w-[calc(100%-2rem)] md:w-[600px] lg:w-[700px] max-w-[700px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 space-y-4"
      style={{
        zIndex: 100,
      }}
    >
      {/* テキスト入力 - リングノート風デザイン */}
      <div className="w-full flex justify-center">
        {/* リングノート背景とテキスト入力を重ねたコンテナ */}
        <div className="relative w-full max-w-md md:max-w-lg" role="region" aria-label="もやもや入力エリア">
          {/* リングノート背景画像（imgタグでアスペクト比を保持） */}
          <img
            ref={memoImageRef}
            src="/memo.png"
            alt=""
            aria-hidden="true"
            className="w-full h-auto"
            style={{
              opacity: 0.95,
              filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))',
            }}
          />

          {/* テキスト入力欄（ノートの紙の部分に配置） */}
          <label htmlFor="moyamoya-input" className="sr-only">
            もやもやを入力してください
          </label>
          <textarea
            id="moyamoya-input"
            ref={textareaRef}
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            onKeyDown={onKeyDown}
            onCompositionStart={onCompositionStart}
            onCompositionEnd={onCompositionEnd}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder="頭に思い浮かぶもやもやを書こう。確定ボタンで焚き火に投げ込めるよ。"
            rows={4}
            aria-describedby="input-instructions"
            className="absolute z-10 left-[10%] w-[80%] text-gray-800 placeholder:text-gray-400 focus:outline-none leading-relaxed font-medium bg-transparent border-none resize-none"
            style={{
              top: `${LAYOUT_CONFIG.TEXTAREA_TOP}%`,
              fontFamily: '"Klee One", cursive, sans-serif',
              fontSize: 'max(16px, min(4vw, 36px))',
            }}
          />
          <span id="input-instructions" className="sr-only">
            もやもやを入力したら、Enterキーを押すか確定ボタンを押して焚き火に投げ込めます
          </span>
        </div>
      </div>
    </div>
  );
};
