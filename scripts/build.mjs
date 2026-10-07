import { mkdir, writeFile, copyFile, cp, rm } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homePage, aboutPage, propertiesPage, projectsPage, eventsPage, contactPage, blogPage, blogArticlePage, privacyPage, termsPage, sitemapPage, detailPage } from '../src/pages.js';
import { projects, events, blogPosts } from '../src/data.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist');
await rm(out, { recursive: true, force: true });

async function write(path, content) {
  const target = join(out, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content, 'utf8');
}

await Promise.all([
  write('index.html', homePage()),
  write('about/index.html', aboutPage()),
  write('properties/index.html', propertiesPage()),
  write('properties/rental/index.html', propertiesPage('rental')),
  write('properties/sale/index.html', propertiesPage('sale')),
  write('properties/plot/index.html', propertiesPage('plot')),
  write('properties/house/index.html', propertiesPage('house')),
  write('properties/flat/index.html', propertiesPage('flat')),
  write('properties/apartment/index.html', propertiesPage('apartment')),
  write('projects/index.html', projectsPage()),
  write('events/index.html', eventsPage()),
  write('blog/index.html', blogPage()),
  write('contact/index.html', contactPage()),
  write('privacy/index.html', privacyPage()),
  write('terms/index.html', termsPage()),
  write('sitemap/index.html', sitemapPage())
]);

for (const [kind, items] of [['projects', projects], ['events', events]]) {
  for (const item of items) {
    if (!item.slug || item.placeholder) continue;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)) throw new Error(`Invalid slug: ${item.slug}`);
    await write(`${kind}/${item.slug}/index.html`, detailPage(kind.slice(0, -1), item));
  }
}

for (const post of blogPosts) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) throw new Error(`Invalid blog slug: ${post.slug}`);
  await write(`blog/${post.slug}/index.html`, blogArticlePage(post));
}

await mkdir(join(out, 'assets'), { recursive: true });
await Promise.all([
  copyFile(join(root, 'src/styles.css'), join(out, 'assets/styles.css')),
  copyFile(join(root, 'src/site.js'), join(out, 'assets/site.js')),
  cp(join(root, 'public'), out, { recursive: true })
]);
console.log('Built Okasha Properties site in dist/');



