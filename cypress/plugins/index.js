const allureWriter = require('@shelex/cypress-allure-plugin/writer');
module.exports = (on, config) => {
    on('before:browser:launch', (browser = {}, args) => {
        if (browser.family === 'chrome') {
            args.push('--disable-dev-shm-usage');
        }

        return args;
    });
    on('after:run', (results) => {
        console.log('Generating allure report');
        const allure = require('allure-commandline');
        const generation = allure(['generate', 'allure-results', '--clean']);
        generation.on('exit', function (exitCode) {
            console.log('Generation is finished with code:', exitCode);
        });
    });
    allureWriter(on, config);
    return config;
};
