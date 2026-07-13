import { cp, mkdir, rm } from 'node:fs/promises';

const site = new URL('../site/', import.meta.url);
await rm(site, { force: true, recursive: true });
await mkdir(site, { recursive: true });
await cp(new URL('../demo/index.html', import.meta.url), new URL('index.html', site));
await cp(new URL('../dist/', import.meta.url), new URL('dist/', site), { recursive: true });
