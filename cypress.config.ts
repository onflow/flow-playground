import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "h1jieb",
  defaultCommandTimeout: 6000,
  screenshotOnRunFailure: false,
  viewportWidth: 1536,
  viewportHeight: 960,
  video: true,
  videoCompression: 32,
  videoUploadOnPasses: false,
  e2e: {
    setupNodeEvents() {},
    baseUrl: 'http://localhost:3000/',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts,jsx,tsx}',
    excludeSpecPattern: ['**/__snapshots__/*', '**/__image_snapshots__/*'],
  },
});
