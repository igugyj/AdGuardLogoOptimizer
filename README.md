# AdGuardLogoOptimizer

一个轻量级的 Tampermonkey / Violentmonkey 用户脚本，通过直接删除 AdGuard 弹窗的 Shadow DOM 宿主元素来移除广告拦截器自带横幅。

即使弹窗使用了**闭合的 Shadow DOM**，此脚本依然有效，因为它不需要操作阴影内部，只需移除包裹它的外层元素。

> [!CAUTION]
> 本解决方案或有风险，如遇页面问题请停用此脚本！

## 特性

- **简单可靠** – 仅用一个选择器定位宿主元素，避免复杂的判断逻辑。
- **自动监听** – 使用 `MutationObserver` 实时监控页面，一旦 AdGuard 重新注入弹窗，立即移除。
- **日志可控** – 可通过配置变量调整日志输出级别（静默、信息、调试）。
- **手动触发** – 控制台执行 `__removeAdGuardHost()` 可随时手动清除。

## 安装

1. 安装用户脚本管理器，如 [Tampermonkey](https://www.tampermonkey.net/) 或 [Violentmonkey](https://violentmonkey.github.io/)。
2. 新建脚本，将 `AdGuardLogoOptimizer.user.js` 的内容完整粘贴进去。
3. 保存并确保脚本处于启用状态。

> 默认选择器为 `html > div:nth-child(3)`，对多数网站有效。
> 如果误删了其他元素，请按下方说明更新选择器。

## 自定义选择器

如果默认选择器在你的环境下不准确（误删或无效），可以通过浏览器开发者工具获取精确选择器：

1. 打开出现 AdGuard 横幅的网页。
2. 右键横幅，选择 **检查元素**（或按 `F12`）。
3. 在元素树中找到包含 `#shadow-root (closed)` 的最外层 `<div>`。
4. 右键该元素 → **复制** → **复制选择器**。
5. 将脚本开头的 `HOST_SELECTOR` 替换为你复制的值。

## 配置

脚本顶部的配置项：

```javascript
const HOST_SELECTOR = 'html > div:nth-child(3)'; // 替换为你自己的选择器
const LOG_LEVEL = 1; // 0=静默，1=错误，2=信息，3=调试
```

日常使用时建议保持 `LOG_LEVEL=0` 以减少控制台输出。

## 手动清除

在浏览器控制台输入以下命令即可立即移除当前页面的弹窗：

```js
__removeAdGuardHost()
```

## 原理

AdGuard 注入的横幅内容封装在一个闭合的 Shadow DOM 中，无法通过常规 JS 直接修改。
本脚本通过 `document.querySelectorAll` 找到包裹阴影的宿主元素，直接将其从 DOM 树中移除，即可瞬间让弹窗消失。

## 许可证

MIT © Pfolg
