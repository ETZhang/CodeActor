# CodeActor 🎭

**[English](README.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md) | [Español](README.es.md) | [Français](README.fr.md)**

> コードベースを3Dカートゥンキャラクターに変換

![CodeActor Demo](example1.png)

CodeActorは創造的なコード可視化化ツールです。コードベースを分析し、各モジュールを個性的ある3Dカートゥンキャラクターに変換し、コードの依存関係を興味深いソーシャルストーリーに変えます。

## 特徴

- **3Dキャラクター擬人化**: コードの機能に基づいて可愛らしい3Dカートゥンキャラクターを自動生成
- **ソーシャル関係ネットワーク**: 依存関係を面白いソーシャル記述（親友、片思い、禁断の関係...）に変換
- **ヘルス検出**: バグリスクを自動的に識別し、病気のキャラクターは特別な視覚効果を表示
- **双方向3D**: ドラッグ、ズーム、クリックで詳細を表示
- **複数の出力形式**: JSON、Mermaidチャート、ナラティブテキストをサポート
- **超太いパイプ**: 関係線がはっきり見える（半径0.8）
- **フロー粒子**: コード呼び出し方向を動的に表示
- **双方向関係**: 相互依存のダブル矢印をサポート

## キャラクタータイプ

| タイプ | コードパターン | 視覚的特徴 |
|------|---------------|---------------|
| 🔥 熱血主人公 | main/app/index | マント、輝く目 |
| 🛡️ 信頼できる柱 | database/model | 丸い体、眼鏡、髭 |
| 💚 默っている助手 | util/helper | 天使の輪、小さな翼 |
| 🎪 奇妙なキャラクター | middleware | 多面体の体、疑問符帽子 |
| 🌙 謎的な人物 | config/constant | 透明な体、輝く目 |
| ⚡ 忙しい蜂 | 高頻度呼び出し | ネクタイ、ブリーフケース、汗滴 |
| 🌸 脆弱な魂 | 複雑なモジュール | 細長い体、絆創膏、涙滴 |
| 🌑 孤独な旅人 | 呼び出しなし | 半透明、消え行く輪 |

## 🎯 ユニバーサルAIエディタSkill

CodeActorは**主要なAIエディタとIDE**すべて対応:

| エディタ | スータス | インストール方法 |
|---------|----------|------------------|
| **Claude Code** | ✅ ネイティブ | 内臓Skillサポート |
| **Cursor** | ✅ 互換 | Claude Code Skillシステム使用 |
| **OpenHands（旧Moltbot）** | ✅ 互換 | カスタムコマンド追加 |
| **GitHub Copilot** | ✅ 互換 | 拡張としてインストール |
| **Continue.dev** | ✅ 互換 | CLI統合 |
| **Windsurf** | ✅ 互換 | カスタムコマンド追加 |
| **Tabnine** | ✅ 互換 | CLIプラグイン |
| **Codeium** | ✅ 互換 | 拡張API |

---

## クイックスタート

### Claude Code Skillとして使用（推奨）

```bash
# スキルをグローバルにインストール
cd /path/to/CodeActor
npm run build
mkdir -p ~/.claude/skills
cp -r . ~/.claude/skills/code-actor

# どのプロジェクトでも使用
/code-actor
```

### 他のAIエディタ用インストール

#### OpenHands 🦾（旧Moltbot）

**方法 1：カスタムサーバー追加**

1. OpenHands設定を開く
2. **Custom Servers**または**Model Settings**へ
3. 新サーバー追加：
   - 名前：`CodeActor`
   - URL: `https://npx.code-actor.dev`
   - またはローカル：`node /path/to/CodeActor/dist/cli/index.js serve .`

**方法 2：直接npx統合**

```bash
# OpenHandsはnpxコマンド直接実行可能
npx code-actor analyze ./path --format=json
npx code-actor serve ./path
```

#### Cursorエディタ

#### Cursorエディタ
```bash
# CursorはClaude Code Skill使用
# Claude Codeと同にインストール
cd /path/to/CodeActor
npm run build
mkdir -p ~/.claude/skills
cp -r . ~/.claude/skills/code-actor
# Cursorで使用可能
```

#### GitHub Copilot
```bash
# npmでインストール（近日公開）
npm install -g code-actor

# または直接使用
npx code-actor analyze ./path/to/project
```

#### Continue.dev / Windsurf / Tabnine
```bash
# CLIツールとして使用
npx code-actor analyze ./path --format=json
npx code-actor analyze ./path --format=mermaid
npx code-actor serve ./path
```

#### VS Code拡張
```bash
# マーケットプレイスからインストール（近日公開）
code --install-extension ETZhang.code-actor

# またはローカルビルド
cd /path/to/CodeActor
npm run build
code --install-extension ./dist/vscode
```

### スタンドアローン

```bash
# リポジトリをクローン
git clone https://github.com/ETZhang/CodeActor.git
cd code-actor

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev

# ビルド
npm run build
```

### Webインターフェース

`index.html`をブラウザで直接開いてください。

## 関係タイプ

| タイプ | コードの意味 | ソーシャル記述 |
|------|---------------|-------------------|
| 親友 | 強結合 | いつも一緒 |
| 片思い | 一方向依存 | 片思い |
| 禁断の関係 | 循環依存 | 複雑な関係 |
| 匿名の樹洞 | 非同期通信 | グループチャット |
| 偶像崇拜 | 弱い依存 | ファンがフォロー |
| 契約関係 | インターフェース依存 | 契約を締結 |

## ヘルス状態

- **優秀** 🟢: バグリスク低、健康的な表示
- **良好** 🔵: コード品質良好
- **亜健康** 🟡: バグリスク中程度、注意が必要
- **不健康** 🟠: 複雑度高、リファクタリング推奨
- **危険** 🔴: バグリスク高、至急の修正が必要

## インタラクション

- **シングルクリック**: 詳細な属性パネルを表示
- **ダブルクリック**: 関連する全ての関係をハイライト
- **トラッグ**: キャラクターの位置を調整して複雑なネットワークを整理
- **スクロール**: ズームを拡大縮小
- **右ドラッグ**: カメラを回転

## プロジェクト構造

```
code-actor/
├── src/
│   ├── analyzer/          # コード解析エンジン
│   │   ├── parser.ts      # 多言語パーサー
│   │   ├── character-generator.ts  # キャラクター個性生成
│   │   ├── relation-analyzer.ts    # 関係解析
│   │   └── types.ts       # 型定義
│   ├── visualizer/        # Three.js可視化
│   │   ├── scene-manager.ts        # シーン管理
│   │   ├── character-mesh.ts       # 3Dキャラクター生成（目の半径0.15）
│   │   ├── interaction-manager.ts  # インタラクション処理
│   │   └── animation-manager.ts     # アニメーション効果
│   ├── cli/              # CLIエントリ
│   └── web/              # Webフロントエンド
├── skills/               # Claude Code Skill定義
└── index.html            # Webインターフェースエントリ
```

## 技術スタック

- **解析エンジン**: TypeScript、JS/TS/Python/Javaなどをサポート
- **3Dレンタリング**: Three.js、手続き的キャラクター生成
- **フロントエンド**: Vite + ネイティブTypeScript
- **CLI**: Node.js + Express + WebSocket

## 最近の更新

- ✅ パイプの半径を0.8に修正し、見やすくしました
- ✅ 目のサイズを0.15に拡大し、キャラクターの表現力を向上
- ✅ コード呼び出し方向を示すフロー粒子アニメーションを追加
- ✅ 双方向依存のダブル矢印をサポート
- ✅ `/code-actor`コマンドをサポートするClaude Code Skillを作成

## ライセンス

MIT

---

コード理解をより楽しく！ 🎭✨
