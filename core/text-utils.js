export function normalizeText(value) {
    return String(value ?? '').toLowerCase();
}

export function escapeRegex(value) {
    return String(value ?? '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function clampNumber(value, fallback, min, max) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        return fallback;
    }

    return Math.min(max, Math.max(min, parsed));
}

export function truncateText(value, maxLength) {
    const text = String(value ?? '').trim();
    if (text.length <= maxLength) {
        return text;
    }

    return `${text.slice(0, Math.max(0, maxLength - 1))}...`;
}

export function uniqueStrings(values) {
    return [...new Set(values.filter(Boolean).map(value => String(value)))];
}

export function splitIntoSentences(text) {
    return String(text ?? '')
        .split(/(?<=[.!?。！？\n])/u)
        .map(part => part.trim())
        .filter(Boolean);
}

export function countTermHits(text, term) {
    if (!text || !term) {
        return 0;
    }

    const matches = text.match(new RegExp(escapeRegex(term), 'gu'));
    return matches?.length ?? 0;
}

export function normalizeUrl(value) {
    return String(value ?? '').trim().replace(/\/+$/, '');
}

export function parseBlockRules(value) {
    return String(value ?? '')
        .split(/\r?\n/u)
        .map(line => line.trim())
        .filter(Boolean);
}

export function matchesBlockRule(text, rule) {
    const source = String(text ?? '');
    const rawRule = String(rule ?? '').trim();
    if (!source || !rawRule) {
        return false;
    }

    const regexMatch = rawRule.match(/^\/(.+)\/([a-z]*)$/iu);
    if (regexMatch) {
        try {
            return new RegExp(regexMatch[1], regexMatch[2]).test(source);
        } catch {
            return false;
        }
    }

    return normalizeText(source).includes(normalizeText(rawRule));
}
