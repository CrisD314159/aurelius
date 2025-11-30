# electron-test

A minimal Electron template with React + TypeScript + Tailwind CSS — set up with Electron Forge and a webpack renderer.

This repository is a starter template you can use to build a desktop app using Electron, React (with TypeScript), and Tailwind for styling.

## Features

- Electron + React (TypeScript)
- Tailwind CSS configured via PostCSS
- Webpack renderer + main build (Electron Forge with plugin-webpack)
- Preload script ready for secure IPC
- Packaging + makers configured via Electron Forge

## Prerequisites

- Node.js (LTS recommended). This template was developed with Node.js >= 16 — use a modern LTS (18 or 20+) for best results.
- npm (comes with Node.js) or yarn/pnpm.

Verify Node and npm:

```bash
node -v
npm -v
```

## Quick start

Install dependencies:

```bash
npm install
```

Run the app in development (starts Electron via Electron Forge):

```bash
npm start
```

Lint the code:

```bash
npm run lint
```

Create packaged artifacts (platform-specific):

```bash
npm run package
```

Create distributables using makers (DMG/ZIP/DEB/RPM/etc. depending on platform):

```bash
npm run make
```

Publish (as configured in your forge config and makers):

```bash
npm run publish
```

## Project structure

Top-level files you'll commonly use:

- `forge.config.ts` - Electron Forge configuration (makers, plugins).
- `webpack.main.config.ts`, `webpack.renderer.config.ts`, `webpack.plugins.ts`, `webpack.rules.ts` - Webpack config for main and renderer.
- `tsconfig.json` - TypeScript configuration.
- `tailwind.config.js` - Tailwind configuration.
- `postcss.config.js` - PostCSS + Tailwind pipeline.

src/ (renderer + main sources)

- `index.ts` - Electron main (entry) or where the app bootstraps (check your main webpack target).
- `preload.ts` - Preload script (exposes safe, minimal APIs to renderer).
- `renderer.ts` / `app.tsx` - Renderer entry that mounts React app.
- `index.html` - Renderer HTML shell.
- `index.css` - Tailwind entry (where Tailwind directives like `@tailwind base;` are included).
- `pages/MainPage.tsx` - Example page component using React + Tailwind.

Adjust paths and filenames if your project uses a different layout.

## Tailwind notes

Tailwind is already setup using PostCSS. Styles are typically imported from `src/index.css` (or `index.css` at the project root depending on your setup). When adding Tailwind classes in React components, the build pipeline will process them through PostCSS and Tailwind.

If you add new files with Tailwind classes and classes aren't appearing in the final CSS, check `tailwind.config.js` `content` entries to ensure they include your component paths (e.g. `src/**/*.{ts,tsx,js,jsx}`).

## Security & preload

- Keep renderer code untrusted. Use `preload.ts` to expose only safe, minimal APIs via contextBridge.
- Avoid enabling nodeIntegration in the renderer unless you explicitly need it and understand the risks.

## Packaging

- `npm run package` will create a packaged app (not installer) in the `out` directory (Electron Forge behavior).
- `npm run make` will build platform installers using configured makers (e.g., DMG on macOS, MSI on Windows, DEB/RPM on Linux).

For code signing, notarization, and platform-specific packaging tweaks, update `forge.config.ts` and follow Electron Forge/maker documentation.

## Common tasks

Add a new React page/component

1. Create a new `.tsx` file in `src/pages` or `src/ui`.
2. Import and route to it from your renderer entry (`app.tsx` / `renderer.tsx`).
3. Use Tailwind utility classes in the markup.

Add a native dependency

If you add native/node modules, you may need to rebuild for Electron's runtime using `electron-rebuild` or configure the build accordingly.

## Troubleshooting

- Build or runtime errors after dependency changes: try removing `node_modules` and reinstalling:

```bash
rm -rf node_modules package-lock.json
npm install
```

- If Electron can't start due to incompatible native modules, run a rebuild step or follow the native module's docs.

- If Tailwind classes don't appear or are purged, ensure `tailwind.config.js` `content` globs include your source paths.

## Tests

This template doesn't include tests by default. Consider adding a renderer test setup (Vitest / Jest + React Testing Library) and unit tests for main-process logic where applicable.

## Customization & next steps

- Add TypeScript ESLint rules and Prettier for consistent formatting.
- Add CI (GitHub Actions) to run lint and package checks on push.
- Configure automatic releases / code signing for your platform.

## License

This project is licensed under the MIT License — see `package.json` for license metadata.

