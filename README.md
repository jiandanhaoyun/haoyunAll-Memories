# 世界书读取

一个用于 SillyTavern 的前置 AI 世界书路由插件。插件会在正式生成前读取最近对话、角色卡、绑定世界书和可选状态数据，先做本地候选召回，再让前置 AI 精选本轮真正相关的条目，最后把结果注入 prompt。

目标是减少无关世界书条目占用上下文，让大型世界书、角色背景、地点设定和长期记忆在对话中更稳定地命中。

## 当前板块

- **启动入口**：`index.js` 负责加载核心脚本、挂载菜单入口、显示诊断面板和兜底入口。
- **核心运行时**：`router-core.js` 负责世界书收集、候选召回、AI 精选、prompt 注入、记忆图谱、向量书架和控制台 UI。
- **设置页面**：`settings.html` 提供基础路由、独立模型、记忆图谱、向量书架和调试配置。
- **样式**：`style.css` 提供设置页、悬浮控制台、记忆图谱、动画反馈和移动端适配。
- **公共工具**：`core/` 下放置可逐步拆出的纯逻辑模块。
- **分发产物**：`dist/` 保存 userscript 与 Tavern Helper 导入包等生成结果。
- **临时文件**：`tmp/` 保存本地调试、导出或迁移过程中的临时文件，不参与发布。

## 功能概览

- 前置 AI 世界书路由，可启用独立 OpenAI-compatible 模型。
- 本地关键词粗召回，AI 失败时自动 fallback 到本地评分。
- 支持角色卡内嵌 `character_book.entries`。
- 支持角色、聊天、全局等绑定世界书来源。
- 默认跳过 `disabled` 条目，默认跳过 `constant` 条目以避免重复常驻注入。
- 可选读取 MVU / stat_data 等状态数据作为路由上下文。
- 支持后置轻量记忆图谱整理、审阅队列和可视化维护。
- 支持向量书架，把长文本资料切块后参与召回。
- 悬浮控制台可查看总览、路由结果、注入文本、模型状态、记忆图谱和调试信息。

## 安装

把本目录放入 SillyTavern 扩展目录：

```text
SillyTavern/public/scripts/extensions/third-party/ai-worldbook-router
```

目录中至少需要：

```text
manifest.json
index.js
router-core.js
settings.html
style.css
core/
```

刷新 SillyTavern 页面后，在扩展设置中启用 **世界书读取**。

## 推荐配置

- 初次使用只开启 **启用前置 AI 世界书路由** 和 **启用关键词粗召回**。
- 世界书条目很多时，把 **最大候选条目数** 设为 24-40，把 **最终注入条目数** 设为 3-8。
- 独立路由模型建议使用便宜、响应快、JSON 稳定的小模型。
- 如果常驻世界书已经由 SillyTavern 原生注入，保持 **允许读取常驻条目** 关闭。
- 记忆图谱和向量书架建议分阶段开启，先确认基础路由稳定后再增加长期记忆能力。

## 调试

悬浮控制台可以查看：

- 最近一次候选数量、命中数量、注入字符数和来源。
- 最终选中的世界书 / 记忆 / 书架条目。
- 本轮最终注入文本。
- 发给前置 AI 的 prompt。
- 前置 AI 原始返回和解析错误。
- 后置记忆整理 prompt、返回和错误。

如果想确认“世界书是否真的进入 prompt”，优先查看控制台中的 **本轮最终注入文本**。

## 开发与发布

- 源码文件保持在根目录和 `core/`。
- 生成产物放入 `dist/`，不要直接手改分发包。
- 临时调试文件放入 `tmp/`，不要提交。
- 使用 `node scripts/build-userscript.mjs` 刷新轻量分发产物清单。

## 优化路线

当前 `router-core.js` 仍然较大，后续建议继续拆分：

- `core/settings.js`：默认设置、迁移和保存。
- `core/router.js`：世界书收集、候选召回、AI 精选和注入。
- `core/memory-graph.js`：记忆节点、关系、审阅队列和更新合并。
- `core/bookshelf-vector.js`：IndexedDB、文本切块、embedding 和向量召回。
- `core/ui-console.js`：悬浮窗和控制台渲染。
- `core/compat-hooks.js`：Tavern Helper / fetch fallback / generate 兼容钩子。

## 来源与授权说明

- 原项目地址：https://github.com/wominIII/ai-worldbook-router
- 原作者：zmer
- 后续维护仓库：https://github.com/jiandanhaoyun/haoyunAll-Memories

本仓库保留原项目来源、作者信息与插件主体文件。若原项目或后续维护仓库补充明确许可证，请以原作者发布的授权说明为准。
