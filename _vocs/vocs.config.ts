import { defineConfig } from 'vocs';

export default defineConfig({
  title: 'Docs',
  // @dev should be set to repo name for github pages
  basePath: 'mantra',
  sidebar: [
    {
      text: 'Getting Started',
      link: '/getting-started',
    },
    {
      text: 'Example',
      link: '/example',
    },
  ],
});
