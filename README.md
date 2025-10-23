# 🔥 焚き火 - もやもやを焚き火に投げ込んで心を軽くしよう

頭の中のもやもやを紙に書いて焚き火に投げ込もう。炎が揺らめく癒やしの空間で、心を軽くするシンプルなWebアプリ。

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://ikari-fire.netlify.app/)

## ✨ 特徴

- **シンプルな操作**: テキストを入力してEnterを押すだけ
- **リアルタイムアニメーション**: Lottieを使った美しい炎のアニメーション
- **レスポンシブデザイン**: デスクトップ・モバイル両対応
- **リングノート風UI**: 手書き感のあるデザイン

## 🔥 炎のシステム

### テキストの長さで炎の強さが変わる

- **短文（1-19文字）**: +15 の火力
- **中文（20-79文字）**: +25 の火力
- **長文（80文字以上）**: +35 の火力

### 自動減衰システム

- **10秒間**何も投げ込まないと、火力が下がる
- 放置すると初期値まで自動的に戻る
- 初期値以下にはならない（炎は消えない）

### 炎の動き

- 火力に応じて炎のサイズ、明るさ、速度が変化
- 滑らかなアニメーション（0.8秒のトランジション）
- GPU アクセラレーション対応

## 🚀 技術スタック

- **React 19.1** - UIフレームワーク
- **TypeScript 5.9** - 型安全性
- **Vite 7.1** - 高速ビルドツール
- **Framer Motion 12** - アニメーションライブラリ
- **Lottie React 2.4** - Lottieアニメーション
- **Tailwind CSS 4.1** - ユーティリティファーストCSS


## 📁 プロジェクト構造

```
src/
├── components/          # 再利用可能なコンポーネント
│   ├── CampfireFlame.tsx       # 炎のLottieアニメーション
│   ├── CampfireGlow.tsx        # 炎の輝きエフェクト
│   ├── MemoInput.tsx           # リングノート風入力欄
│   └── PaperScrapAnimation.tsx # 紙切れの飛翔アニメーション
├── hooks/              # カスタムフック
│   ├── useCampfireState.ts     # 焚き火の状態管理
│   ├── useFlameDecay.ts        # 炎の減衰システム
│   ├── useFlameAnimation.ts    # 炎のアニメーション制御
│   └── useScrollPrevention.ts  # スクロール防止（iOS対応）
├── utils/              # ユーティリティ
│   └── coordinateCalculator.ts # 座標計算
├── constants.ts        # 定数の一元管理
├── types.ts           # 型定義
└── App.tsx            # メインコンポーネント
```

## ⚙️ 設定のカスタマイズ

`src/constants.ts` で炎の動作をカスタマイズできます：

```typescript
export const FLAME_CONFIG = {
  INITIAL: 20,              // 炎の初期値
  TARGET: 20,               // 減衰先の値
  DECAY_INTERVAL: 10 * 1000, // 減衰間隔（ミリ秒）
  RANK_STEP: 15,            // 1ランクの火力
  // ...
};

export const INTENSITY_CONFIG = {
  SHORT_TEXT_THRESHOLD: 20,   // 短文の閾値
  MEDIUM_TEXT_THRESHOLD: 80,  // 中文の閾値
  BOOST_LOW: 15,              // 短文の火力
  BOOST_MEDIUM: 25,           // 中文の火力
  BOOST_HIGH: 35,             // 長文の火力
  // ...
};
```

## 🎨 デザインの特徴

### リングノート風UI
- 手書き感のある日本語フォント「Klee One」を使用
- リングノート画像を背景に配置
- 紙がちぎれて飛んでいくアニメーション

### iOS Safari対応
- スクロール完全防止
- フォーカス時のズーム防止（16px以上のフォント）
- IME変換中のEnterキー誤送信防止

### アクセシビリティ
- セマンティックHTML（`role`, `aria-label`）
- スクリーンリーダー対応
- キーボードナビゲーション
- フォーカスインジケーター

## 📊 パフォーマンス

- **ビルドサイズ**: 684 KB (gzip: 193 KB)
- **初回ロード**: 高速
- **GPU アクセラレーション**: 滑らかなアニメーション
- **useMemo最適化**: 不要な再計算を防止


## 📝 ライセンス

MIT License

**もやもやを焚き火に投げ込んで、心を軽くしよう** 🔥✨
