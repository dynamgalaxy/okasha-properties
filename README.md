# Okasha Properties website

A dependency-free, static website for Okasha Properties in Allahabad, Westridge III, Rawalpindi. The workspace was empty when this project was started, so the site uses a small Node build script and plain HTML/CSS/JavaScript.

## Run locally

```bash
npm run build
npm run dev
```

Open `http://localhost:4173/`. The build output is in `dist/` and can be deployed to any static host. The preview server builds once at startup; restart it after source edits.

## Update content

- Edit business details, projects and events in `src/data.js`.
- Replace placeholder project and event entries with confirmed content. Real entries with a valid `slug` automatically generate `/projects/[slug]/` or `/events/[slug]/` detail pages.
- Add image files under `public/` and set each entry's `image` to its public path. The build copies all public assets into `dist/`.
- The contact form uses `site.email` (`info@okashaproperties.com`) and opens the visitor's email app with a prefilled message. It does not send directly or store submissions.
- Add a verified phone number or map URL only when available.
- Replace the three illustrative reel previews in `src/data.js` with confirmed post thumbnails and HTTPS URLs when Okasha Properties social channels launch. Until then, the cards are clearly labeled as concepts and “See more” explains that the reels are pending.

The shared page components live in `src/components.js`, page composition in `src/pages.js`, and styling in `src/styles.css`.

The homepage hero uses `public/home-hero-future.png` and `public/home-hero-future-mobile.png`, illustrative generated architecture concepts based on the supplied design reference. They do not depict a confirmed Okasha Properties project.

The reel preview images in `public/reel-preview-01.jpg` through `public/reel-preview-03.jpg` are also generated illustrative concepts, not actual properties or published social posts.
