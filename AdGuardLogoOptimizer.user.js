// ==UserScript==
// @name         AdGuardLogoOptimizer
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  移除 AdGuard浏览器助手 在每个页面的 logo，通过删除其闭合 Shadow DOM 的宿主元素
// @author       Pfolg, DeepSeek
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // ===== 配置 =====
    // 宿主元素的选择器（外层的 div 包含 #shadow-root）
    // 如果需要，可以替换为自己复制的选择器
    const HOST_SELECTOR = 'html > div:nth-child(3)';

    // 日志级别：0 = 静默，1 = 仅错误，2 = 信息，3 = 调试
    const LOG_LEVEL = 1;
    // ========================

    /**
     * 输出日志，根据 LOG_LEVEL 过滤
     * @param {number} level 日志级别
     * @param {string} msg  日志信息（英文）
     */
    function log(level, msg) {
        if (level <= LOG_LEVEL) {
            console.log('[AdGuardLogoOptimizer]', msg);
        }
    }

    /**
     * 查找并移除所有匹配 HOST_SELECTOR 的元素
     * @returns {number} 移除的元素数量
     */
    function removeHosts() {
        const targets = document.querySelectorAll(HOST_SELECTOR);
        if (targets.length) {
            targets.forEach(el => el.remove());
            log(2, `Removed ${targets.length} host element(s) (selector: "${HOST_SELECTOR}")`);
            return targets.length;
        } else {
            log(3, `No element found for selector: "${HOST_SELECTOR}"`);
            return 0;
        }
    }

    // 初次移除
    const initialCount = removeHosts();
    log(2, `Initial scan complete, removed ${initialCount} element(s)`);

    // 监听 DOM 变化（防止 AdGuard 重新创建宿主元素）
    const observer = new MutationObserver(() => {
        const count = removeHosts();
        if (count > 0) {
            log(2, `MutationObserver removed ${count} element(s)`);
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // 页面完全加载后再检查一次
    window.addEventListener('load', () => {
        const count = removeHosts();
        if (count > 0) {
            log(2, `Page load event: removed ${count} element(s)`);
        } else {
            log(3, 'Page load event: no target found');
        }
    });

    // 暴露手动触发接口到控制台
    window.__removeAdGuardHost = removeHosts;
    log(3, 'Script started. Run __removeAdGuardHost() in console to manually trigger removal.');
})();