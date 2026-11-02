import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { readDocuments } from './scripts/content.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'product-documents',
      resolveId(id) {
        if (id === 'virtual:product-docs') return '\0product-docs';
      },
      async load(id) {
        if (id === '\0product-docs') {
          const content = await readDocuments(root);
          content.documents.forEach((doc: { path: string }) => this.addWatchFile(`${root}/${doc.path}`));
          return `export default ${JSON.stringify(content)}`;
        }
      },
      configureServer(server) {
        server.watcher.add([`${root}/spec`, `${root}/SPEC.md`, `${root}/FLOW.md`]);
        server.watcher.on('all', (_event, path) => {
          if (path.startsWith(`${root}/spec/`) || path === `${root}/SPEC.md` || path === `${root}/FLOW.md`) {
            const module = server.moduleGraph.getModuleById('\0product-docs');
            if (module) server.moduleGraph.invalidateModule(module);
            server.ws.send({ type: 'full-reload' });
          }
        });
      },
    },
  ],
  server: { fs: { allow: [root] } },
});
