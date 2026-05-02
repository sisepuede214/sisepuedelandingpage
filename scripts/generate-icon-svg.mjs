import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const icoPath = path.join(root, 'app', 'favicon.ico');
const b64 = fs.readFileSync(icoPath).toString('base64');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" width="32" height="32">
  <image width="32" height="32" href="data:image/png;base64,${b64}" preserveAspectRatio="xMidYMid meet"/>
</svg>
`;

fs.writeFileSync(path.join(root, 'app', 'icon.svg'), svg);
fs.writeFileSync(path.join(root, 'public', 'favicon.svg'), svg);
fs.copyFileSync(icoPath, path.join(root, 'app', 'apple-icon.png'));
