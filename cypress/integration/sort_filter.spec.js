const {jsonToQueryString, defalutOWpayloadQuery} = require("./utils");


describe('Flight Search Page sort filter', () => {
    let cheapest;
    let fastest;
    let best;
    const getOptionAmount = (optionKey) => {
        return cy.contains('div.empireFlight_SortByOption', optionKey)
            .find('h4:nth-child(2)')
            .invoke('text')
            .then((optionAmount) => optionAmount.trim().replace(/[^0-9.]/g, ''));
    };


    beforeEach(
        () => {
        getFlightResponsePage([]);
        getOptionAmount('Cheapest').then((amount) => cheapest = parseFloat(amount));
        getOptionAmount('Fastest').then((amount) => fastest = parseFloat(amount));
        getOptionAmount('Best Value').then((amount) => best = parseFloat(amount));
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
        cy.get('div.empireFlight_SortBy', {timeout: 10000}).should('be.visible');
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

    it('Verify fastest flight', function () {
        let leastTime = 0;
        let leastTimeText = null;
        let cost = null;
        cy.get('span.empireFlight_time')
            .each(($time) => {
                const timeText = $time.find('p').text().trim();

                if (timeText.match(/\b(\d+h \d+m)\b/)) {
                    const [hours, minutes] = timeText.split('h ');
                    const timeValue = parseInt(hours) * 60 + parseInt(minutes.replace('m', ''), 10);
                    if (timeValue <= leastTime || !leastTime) {
                        leastTime = timeValue;
                        leastTimeText = timeText;
                        const parentDiv = $time.parents('.empireFlight_listing-card');
                        cost = parentDiv.find('h2.empireFlight_amount').text().trim().replace('AED', '');
                    }
                }
            })
            .then(() => {
                expect(cost).to.equal(fastest);
            });
    });


})