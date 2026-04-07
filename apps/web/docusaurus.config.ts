import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'GTS Alpha Forensics',
  tagline: '🦄 AI-Powered Digital Forensics & Cybersecurity Platform',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: process.env.NETLIFY ? (process.env.URL || 'https://unicornlpr.netlify.app') : 'https://pripramot.github.io',
  baseUrl: process.env.NETLIFY ? '/' : '/unicorn/',

  organizationName: 'pripramot',
  projectName: 'unicorn',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'th',
    locales: ['th', 'en'],
    localeConfigs: {
      th: { label: 'ไทย', direction: 'ltr' },
      en: { label: 'English', direction: 'ltr' },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/pripramot/unicorn/tree/main/apps/web/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/pripramot/unicorn/tree/main/apps/web/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/gts-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'GTS Alpha Forensics',
      logo: {
        alt: 'GTS Alpha Forensics Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: '📚 Documentation',
        },
        {to: '/blog', label: '📝 Blog', position: 'left'},
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/pripramot/unicorn',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Platform',
          items: [
            {
              label: '🤖 Agent Server',
              href: '#',
            },
            {
              label: '🧠 Brain Module',
              href: '#',
            },
            {
              label: '🔗 MCP A2A',
              href: '#',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/pripramot/unicorn',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} GTS Alpha Forensics AI Team. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['python', 'bash', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
