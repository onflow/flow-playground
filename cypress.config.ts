import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "h1jieb",
  video: false,
  defaultCommandTimeout: 6000,
  screenshotOnRunFailure: false,
  e2e: {
    setupNodeEvents() {},
    baseUrl: 'http://localhost:3000/',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts,jsx,tsx}',
    excludeSpecPattern: ['**/__snapshots__/*', '**/__image_snapshots__/*'],
  },
});
