/**
 * アプリケーション全体で使用される型定義
 */

/**
 * 焚き火に投げ込まれる紙切れのデータ型
 * ユーザーが入力したテキストがアニメーションで焚き火に飛んでいくときに使用
 */
export interface PaperScrap {
  /** 紙切れを識別するユニークなID（タイムスタンプを使用） */
  id: string;
  /** 紙切れに表示されるテキスト内容 */
  text: string;
  /** テキストの長さに応じた強度（1〜3）、炎の大きさに影響 */
  intensity: 1 | 2 | 3;
  /** アニメーション開始位置（テキスト入力欄の座標） */
  origin: { x: number; y: number };
  /** アニメーション終了位置（焚き火の座標） */
  target: { x: number; y: number };
}

/**
 * 座標を表す型
 */
export interface Coordinates {
  x: number;
  y: number;
}
