const {jsonToQueryString, defalutOWpayloadQuery} = require("./utils");


describe('Flight Search Page sort filter', () => {
    let cheapest;
    const getOptionAmount = (optionKey) => {
        return cy.contains('div.empireFlight_SortByOption', optionKey)
            .find('h4:nth-child(2)')
            .invoke('text')
            .then((optionAmount) => optionAmount.trim().replace(/[^0-9.]/g, ''));
    };


    beforeEach(() => {
        getFlightResponsePage([]);
        getOptionAmount('Cheapest').then((amount) => cheapest =  parseFloat(amount));
    });
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
        cy.get('div.empireFlight_SortBy', { timeout: 10000 }).should('be.visible');
        cy.get('div.empireFlight_SortByWrapper').within(() => {
            cy.contains('Cheapest').should('be.visible');
            cy.contains('Fastest').should('be.visible');
            cy.contains('Best Value').should('be.visible');
        });
    });

    it('Verify cheapest flight', function () {
        let cheapestAmount = null;
        cy.get('h2.empireFlight_amount')
            .each(($amount) => {
                const amountText = $amount.text().trim();
                const amountValue = parseFloat(amountText.replace(/[^0-9.]/g, ''));
                if (!isNaN(amountValue) && (cheapestAmount === null || amountValue < cheapestAmount)) {
                    cheapestAmount = amountValue;
                }
            })
            .then(() => {
                const formattedCheapestAmount = cheapestAmount ? parseFloat(cheapest) : 0;
                expect(formattedCheapestAmount).to.equal(cheapest);
            });
    });


})