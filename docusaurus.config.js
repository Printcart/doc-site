const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(
  module.exports = {
    title: "Printcart",
    tagline: "Web-to-print API",
    favicon: "img/logo-printcart.png",

    // Set the production url of your site here
    url: "https://your-docusaurus-test-site.com",
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: "/",
    
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: "Printcart", // Usually your GitHub org/user name.
    projectName: "Printcart", // Usually your repo name.

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
      defaultLocale: 'en',
      locales: ['en'],
    },

    presets: [
      [
        "@docusaurus/preset-classic",
        /** @type {import('@docusaurus/preset-classic').Options} */
        ({
          docs: {
            sidebarPath: require.resolve("./sidebars.js"),
          },
          blog: {
            showReadingTime: true,
          },
          theme: {
            customCss: require.resolve("./src/css/custom.css"),
          },
        }),
      ],
      [
        "redocusaurus",
        {
          specs: [
            {
              spec: "./api-data/printcart-api.yaml",
              route: "/rest-api-reference/",
            },
          ],
        },
      ],
    ],

    themeConfig:
      /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      ({
        navbar: {
          logo: {
            alt: "My Site Logo",
            src: "img/Logo-PrintCart-1.png",
          },
          items: [
            {
              type: "doc",
              docId: "users-manual/get-started",
              position: "left",
              label: "Shop Owner",
            },
            // {
            //   type: "doc",
            //   docId: "online-design/introduce",
            //   position: "left",
            //   label: "Online Design Tool",
            // },
            {
              type: "doc",
              docId: "api-sdk/intro",
              position: "left",
              label: "Developer Guide",
            },
            {
              type: "doc",
              docId: "reference/design-tool-sdk",
              position: "left",
              label: "API Reference",
            },
          ],
        },
        footer: {
          style: "light",
          copyright: `Copyright © ${new Date().getFullYear()} Printcart, Inc.`,
        },
        prism: {
          theme: lightCodeTheme,
          darkTheme: darkCodeTheme,
        },
      }),
  }
);
