const BOOT_LOG_PREFIX = '[AI Worldbook Router Bootstrap]';
const BOOT_ENTRY_ID = 'ai_wbr_bootstrap_entry';
const BOOT_PANEL_ID = 'ai_wbr_bootstrap_panel';
const BOOT_MENU_ENTRY_ID = 'ai_wbr_extension_entry';
const BOOT_MENU_RETRY_LIMIT = 80;
let bootMenuRetryTimer = null;

function openRouterConsoleFromBootstrap() {
    if (typeof globalThis.aiWbrOpenConsole === 'function') {
        globalThis.aiWbrOpenConsole('overview');
        return;
    }

    const fullWindow = document.getElementById('ai_wbr_floating_window');
    if (fullWindow) {
        fullWindow.classList.remove('closing');
        fullWindow.classList.add('open');
        return;
    }

    const fullButton = document.getElementById('ai_wbr_fab');
    if (fullButton) {
        fullButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        window.setTimeout(() => {
            if (!document.getElementById('ai_wbr_floating_window')?.classList.contains('open')) {
                showBootstrapPanel('已触发完整入口，但控制台未打开。请查看下方状态。');
            }
        }, 160);
        return;
    }

    showBootstrapPanel();
}

function createBootstrapEntry() {
    if (document.getElementById(BOOT_ENTRY_ID) || document.getElementById('ai_wbr_fab')) {
        return;
    }

    const button = document.createElement('button');
    button.id = BOOT_ENTRY_ID;
    button.type = 'button';
    button.textContent = '世界书';
    button.title = '打开世界书读取控制台';
    button.style.cssText = [
        'position:fixed',
        'right:14px',
        'bottom:calc(82px + env(safe-area-inset-bottom, 0px))',
        'z-index:2147483647',
        'min-width:58px',
        'height:42px',
        'padding:0 10px',
        'border-radius:999px',
        'border:1px solid rgba(176,225,255,.72)',
        'background:rgba(20,24,34,.96)',
        'color:#d7f5ff',
        'font-size:13px',
        'font-weight:700',
        'box-shadow:0 10px 24px rgba(0,0,0,.35),0 0 18px rgba(125,212,255,.28)',
        'backdrop-filter:blur(8px)',
        'cursor:pointer'
    ].join(';');

    button.addEventListener('click', openRouterConsoleFromBootstrap);

    (document.body || document.documentElement).appendChild(button);
}

function createExtensionMenuEntry() {
    const entry = document.createElement('div');
    entry.id = BOOT_MENU_ENTRY_ID;
    entry.className = 'extension_container interactable ai-wbr-extension-entry';
    entry.title = '世界书读取';
    entry.setAttribute('role', 'button');
    entry.setAttribute('aria-label', '世界书读取');
    entry.tabIndex = 0;

    const row = document.createElement('div');
    row.className = 'list-group-item flex-container flexGap5 interactable ai-wbr-extension-row';
    row.setAttribute('role', 'listitem');
    row.tabIndex = 0;
    row.title = '世界书读取';

    const icon = document.createElement('div');
    icon.className = 'fa-fw fa-solid fa-network-wired extensionsMenuExtensionButton ai-wbr-extension-icon';
    icon.setAttribute('role', 'button');
    icon.tabIndex = 0;

    const label = document.createElement('span');
    label.className = 'ai-wbr-extension-label';
    label.textContent = '世界书读取';

    row.append(icon, label);
    entry.appendChild(row);

    const handleOpen = (event) => {
        event.preventDefault();
        event.stopPropagation();
        openRouterConsoleFromBootstrap();
    };

    entry.addEventListener('click', handleOpen);
    row.addEventListener('click', handleOpen);
    entry.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') handleOpen(event);
    });
    row.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') handleOpen(event);
    });

    return entry;
}

function mountExtensionMenuEntry() {
    const host = document.getElementById('extensionsMenu') || document.getElementById('top-settings-holder');
    if (!host) {
        return false;
    }

    let entry = document.getElementById(BOOT_MENU_ENTRY_ID);
    if (!entry) {
        entry = createExtensionMenuEntry();
    }

    if (entry.parentElement !== host) {
        host.insertBefore(entry, host.firstChild);
    }

    return true;
}

function watchExtensionMenuButton() {
    const button = document.getElementById('extensionsMenuButton');
    if (!button || button.dataset.aiWbrBound === 'true') {
        return;
    }

    button.dataset.aiWbrBound = 'true';
    button.addEventListener('click', () => {
        window.setTimeout(mountExtensionMenuEntry, 0);
        window.setTimeout(mountExtensionMenuEntry, 100);
        window.setTimeout(mountExtensionMenuEntry, 300);
    });
}

function startExtensionMenuMounting() {
    watchExtensionMenuButton();
    if (mountExtensionMenuEntry()) {
        return;
    }

    let attempts = 0;
    window.clearInterval(bootMenuRetryTimer);
    bootMenuRetryTimer = window.setInterval(() => {
        attempts += 1;
        watchExtensionMenuButton();
        if (mountExtensionMenuEntry() || attempts >= BOOT_MENU_RETRY_LIMIT) {
            window.clearInterval(bootMenuRetryTimer);
            bootMenuRetryTimer = null;
        }
    }, 250);
}

function showBootstrapPanel(message = '') {
    let panel = document.getElementById(BOOT_PANEL_ID);
    if (!panel) {
        panel = document.createElement('div');
        panel.id = BOOT_PANEL_ID;
        panel.style.cssText = [
            'position:fixed',
            'right:12px',
            'bottom:calc(132px + env(safe-area-inset-bottom, 0px))',
            'z-index:2147483647',
            'width:min(92vw,360px)',
            'max-height:58vh',
            'overflow:auto',
            'border:1px solid rgba(176,225,255,.42)',
            'border-radius:12px',
            'background:rgba(14,17,24,.98)',
            'color:#f2fbff',
            'box-shadow:0 18px 42px rgba(0,0,0,.45)',
            'padding:14px',
            'font:14px/1.5 system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif'
        ].join(';');
        document.body.appendChild(panel);
    }

    panel.innerHTML = '';
    const title = document.createElement('div');
    title.textContent = '世界书读取';
    title.style.cssText = 'font-weight:800;font-size:16px;margin-bottom:8px;color:#d7f5ff';
    panel.appendChild(title);

    const text = document.createElement('div');
    text.textContent = message || '入口已加载。完整控制台正在初始化，如果长时间没有出现，请查看下方状态。';
    panel.appendChild(text);

    const hint = document.createElement('pre');
    hint.textContent = [
        `coreLoaded: ${Boolean(globalThis.ai_worldbook_router_intercept)}`,
        `jQuery: ${typeof (globalThis.jQuery || globalThis.$)}`,
        `corePath: ${new URL('./router-core.js', import.meta.url).href}`
    ].join('\n');
    hint.style.cssText = 'white-space:pre-wrap;margin:10px 0 0;padding:8px;border-radius:8px;background:rgba(255,255,255,.08);color:#d7f5ff;font-size:12px';
    panel.appendChild(hint);

    const close = document.createElement('button');
    close.type = 'button';
    close.textContent = '关闭';
    close.style.cssText = 'margin-top:10px;padding:6px 12px;border-radius:8px;border:1px solid rgba(176,225,255,.35);background:rgba(255,255,255,.08);color:#fff';
    close.addEventListener('click', () => panel.remove());
    panel.appendChild(close);
}

async function loadRouterCore() {
    createBootstrapEntry();
    startExtensionMenuMounting();
    try {
        await import('./router-core.js');
        const entry = document.getElementById(BOOT_ENTRY_ID);
        if (document.getElementById('ai_wbr_fab')) {
            entry?.remove();
        }
        startExtensionMenuMounting();
        console.info(`${BOOT_LOG_PREFIX} core loaded`);
    } catch (error) {
        console.error(`${BOOT_LOG_PREFIX} core failed to load`, error);
        showBootstrapPanel(`核心模块加载失败：${error?.message || error}`);
    }
}

if (document.body) {
    loadRouterCore();
} else {
    document.addEventListener('DOMContentLoaded', loadRouterCore, { once: true });
}
