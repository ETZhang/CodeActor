# CodeActor 🎭

**[English](README.md) | [简体中文](README.zh-CN.md)**

> 把代码库变成可爱的 3D 卡通角色剧场

![CodeActor 演示](example1.png)

CodeActor 是一个创意代码可视化工具，它会分析你的代码库，将每个模块变成有性格的 3D 卡通角色，把代码之间的调用关系变成有趣的社交故事。

## 特性

- **3D 角色拟人化**：根据代码功能自动生成可爱的 3D 卡通角色
- **社交关系网**：将依赖关系转化为有趣的社交描述（死党、单恋、禁忌之恋...）
- **健康检测**：自动识别 Bug 风险，生病角色会有特殊视觉效果
- **可交互 3D**：拖拽、缩放、点击查看详情
- **多种导出**：支持 JSON、Mermaid 图表、叙事文本
- **超粗管道**：关系线清晰可见（半径 0.8）
- **流动粒子**：动态展示代码调用方向
- **双向关系**：支持双向依赖的箭头展示

## 角色类型

| 性格 | 对应代码 | 外观特征 |
|------|----------|----------|
| 🔥 热血主角 | main/app/index | 披风、炯炯有神的眼睛 |
| 🛡️ 可靠支柱 | database/model | 圆润身材、眼镜、胡子 |
| 💚 默默助手 | util/helper | 天使光环、小翅膀 |
| 🎪 古怪角色 | middleware | 多面体身体、问号帽子 |
| 🌙 神秘人物 | config/constant | 透明身体、发光眼睛 |
| ⚡ 忙碌蜜蜂 | 高频调用 | 领带、公文包、汗滴 |
| 🌸 脆弱灵魂 | 复杂模块 | 细长身体、创可贴、泪滴 |
| 🌑 孤独行者 | 无人调用 | 半透明、渐隐光环 |

## 快速开始

### 作为 Claude Code Skill 使用（推荐）

```bash
# 全局安装技能
cd /path/to/CodeActor
npm run build
mkdir -p ~/.claude/skills
cp -r . ~/.claude/skills/code-actor

# 在任何项目中使用
/code-actor
```

### 独立使用

```bash
# 克隆仓库
git clone https://github.com/ETZhang/CodeActor.git
cd code-actor

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build
```

### Web 界面

直接在浏览器中打开 `index.html` 即可使用。

## 社交关系

| 类型 | 代码含义 | 社交描述 |
|------|----------|----------|
| 死党 | 强耦合依赖 | 形影不离 |
| 单恋 | 单向依赖 | 一方依赖另一方 |
| 禁忌之恋 | 循环依赖 | 剪不断理还乱 |
| 匿名树洞 | 异步通知 | 群聊发消息 |
| 偶像崇拜 | 弱依赖 | 粉丝关注 |
| 契约关系 | 接口依赖 | 签订契约 |

## 健康状态

- **优秀** 🟢：Bug 风险低，健康显示
- **良好** 🔵：代码质量良好
- **亚健康** 🟡：Bug 风险中等，需关注
- **不健康** 🟠：代码复杂度高，建议重构
- **危险** 🔴：Bug 风险高，急需修复

## 交互方式

- **单击角色**：查看详细属性面板
- **双击角色**：高亮显示所有相关关系
- **拖动角色**：调整位置，理清复杂关系网
- **滚动滚轮**：缩放视图
- **右键拖动**：旋转视角

## 项目结构

```
code-actor/
├── src/
│   ├── analyzer/          # 代码分析引擎
│   │   ├── parser.ts      # 多语言代码解析器
│   │   ├── character-generator.ts  # 角色人设生成
│   │   ├── relation-analyzer.ts    # 关系分析
│   │   └── types.ts       # 类型定义
│   ├── visualizer/        # Three.js 可视化
│   │   ├── scene-manager.ts        # 场景管理
│   │   ├── character-mesh.ts       # 3D 角色生成（眼睛半径 0.15）
│   │   ├── interaction-manager.ts  # 交互处理
│   │   └── animation-manager.ts     # 动画效果
│   ├── cli/              # CLI 入口
│   └── web/              # Web 前端
├── skills/               # Claude Code Skill 定义
└── index.html            # Web 界面入口
```

## 技术栈

- **分析引擎**：TypeScript，支持 JS/TS/Python/Java 等多语言
- **3D 渲染**：Three.js，程序化生成卡通角色
- **前端**：Vite + 原生 TypeScript
- **CLI**：Node.js + Express + WebSocket

## 最近更新

- ✅ 修复管道半径为 0.8，确保清晰可见
- ✅ 增大眼睛尺寸至 0.15，提升角色生动度
- ✅ 添加流动粒子动效，展示代码调用方向
- ✅ 支持双向关系，双箭头展示相互依赖
- ✅ 创建 Claude Code Skill，支持 `/code-actor` 命令

## 许可

MIT

---

让代码理解变得更有趣！ 🎭✨
