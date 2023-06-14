const {jsonToQueryString, defalutOWpayloadQuery} = require("./utils");


describe('Flight Search Page sort filter', () => {

    const getOptionAmount = (optionKey) => {
        let optionAmount = '';

        cy.get('div.empireFlight_SortByWrapper').within(() => {
            cy.contains(optionKey).then(($option) => {
                optionAmount = $option.find('.empireFlight_SortByOption h4').text();
            });
        });

        return optionAmount;
    }
    const waitForLowfareRequest = () => {
        cy.wait('@lowfareRequest', {timeout: 120000});
        cy.wait(2000);
    };
    const getFlightResponsePage = (query) => {
        cy.intercept('POST', '**/api/v2/offer/lowfare').as('lowfareRequest');
        const URL = `Flight/search?${jsonToQueryString(defalutOWpayloadQuery(...query))}`;
        cy.visit(URL);
        cy.wait(2000);
        waitForLowfareRequest();
    };

    it('Verify sort filters are visible', function () {
        getFlightResponsePage([])
        cy.get('div.empireFlight_SortBy', { timeout: 10000 }).should('be.visible');
        cy.get('div.empireFlight_SortByWrapper').within(() => {
            cy.contains('Cheapest').should('be.visible');
            cy.contains('Fastest').should('be.visible');
            cy.contains('Best Value').should('be.visible');
        });
    });

    it('Verify cheapest flight', function () {
        getFlightResponsePage([])
        const cheapest = getOptionAmount('Cheapest')

    })
})