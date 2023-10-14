const {defineConfig} = require("cypress");
const allureWriter = require("@shelex/cypress-allure-plugin/writer");


module.exports = defineConfig({
    e2e: {
        specPattern: 'cypress/integration/**/*.spec.js',
        baseUrl: 'https://ngtest.aos-dev.com/',
        retries: 1,
        viewportWidth: 1600,
        chromeFlags: '--disable-gpu --no-sandbox --disable-dev-shm-usage',
        projectId: 'allure-cypress-aos-test',
        setupNodeEvents(on, config) {
            allureWriter(on, config);
            return config;
        },
        env: {
            allure:true, // enable allure plugin
            allureResultsPath: 'allure-results'

        }

    }
});
