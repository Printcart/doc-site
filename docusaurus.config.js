const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(
  module.exports = {
    title: "Printcart",
    tagline: "Web-to-print API",
    url: "https://your-docusaurus-test-site.com",
    baseUrl: "/",
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",
    favicon: "img/logo-printcart.png",
    organizationName: "Printcart", // Usually your GitHub org/user name.
    projectName: "Printcart", // Usually your repo name.

    presets: [
      [
        "@docusaurus/preset-classic",
        /** @type {import('@docusaurus/preset-classic').Options} */
        ({
          docs: {
            sidebarPath: require.resolve("./sidebars.js"),
            // Please change this to your repo.
            editUrl:
              "https://github.com/facebook/docusaurus/edit/main/website/",
          },
          blog: {
            showReadingTime: true,
            // Please change this to your repo.
            editUrl:
              "https://github.com/facebook/docusaurus/edit/main/website/blog/",
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
              // to: 'docs/dashboard-manual/introduce',
              type: "doc",
              docId: "welcome",
              position: "left",
              label: "Welcome Printcart",
            },
            // {
            //   type: "doc",
            //   docId: "guides/quickstart",
            //   position: "left",
            //   label: "Quickstart Guides",
            // },
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
              label: "API",
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
