import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(rootDir, 'dist');

const files = [
    'manifest.json',
    'index.js',
    'router-core.js',
    'settings.html',
    'style.css',
];

await fs.mkdir(distDir, { recursive: true });

const manifest = JSON.parse(await fs.readFile(path.join(rootDir, 'manifest.json'), 'utf8'));
const generatedAt = new Date().toISOString();

const summary = {
    name: manifest.display_name,
    id: manifest.id,
    version: manifest.version,
    generatedAt,
    files: [],
};

for (const file of files) {
    const fullPath = path.join(rootDir, file);
    const stat = await fs.stat(fullPath);
    summary.files.push({
        file,
        bytes: stat.size,
        modifiedAt: stat.mtime.toISOString(),
    });
}

await fs.writeFile(
    path.join(distDir, 'build-manifest.json'),
    `${JSON.stringify(summary, null, 2)}\n`,
    'utf8',
);

console.log(`Wrote ${path.relative(rootDir, path.join(distDir, 'build-manifest.json'))}`);
