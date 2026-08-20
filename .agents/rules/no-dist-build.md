# Build & Distribution Guidelines

- **Do NOT run production build commands (e.g., `npm run build`) or generate `dist/` build output automatically** during edits or verification.
- Only run production builds and create `dist/` output when the user explicitly asks to build the project.
- Use type-checking (`npx tsc --noEmit`), dev server (`npm run dev`), or linter checks for code verification instead of production builds.
