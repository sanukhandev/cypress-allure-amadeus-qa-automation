const allureWriter = require('@shelex/cypress-allure-plugin/writer');

module.exports = (on, config) => {
    on('before:browser:launch', (browser = {}, args) => {
        if (browser.family === 'chrome') {
            args.push('--disable-dev-shm-usage');
        }

        return args;
    });
    allureWriter(on, config);
    return config;
};
