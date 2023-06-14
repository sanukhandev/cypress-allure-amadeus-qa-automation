const {defineConfig} = require("cypress");
const allureWriter = require("@shelex/cypress-allure-plugin/writer");


module.exports = defineConfig({
    e2e: {
        specPattern: 'cypress/integration/**/*.spec.js',
        baseUrl: 'https://ngtest.preprod.amadeusonlinesuite.com/',
        retries: 1,
        viewportWidth: 1600,
        chromeFlags: '--disable-gpu --no-sandbox',
        setupNodeEvents(on, config) {
            allureWriter(on, config);
            return config;
        },
        env: {

        }

    }
});
