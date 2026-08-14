# pugazhenthi.com

Personal portfolio website built with React + Vite.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The build output is generated in `dist/`.

## Deployment (GitHub Pages)

This repository includes a GitHub Actions workflow at `/home/runner/work/pugazhenthi.com/pugazhenthi.com/.github/workflows/static.yml` that automatically:

1. Installs dependencies (`npm ci`)
2. Builds the app (`npm run build`)
3. Deploys `dist/` to GitHub Pages

### Build settings reference

- Build command: `npm run build`
- Output directory: `dist`

## Custom domain and HTTPS

If you use a custom domain:

1. Configure the domain in **Settings → Pages**.
2. Add/update a `CNAME` file in `public/` with your domain value.
3. Enable **Enforce HTTPS** in the same Pages settings screen.
