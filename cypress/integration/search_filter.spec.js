const {jsonToQueryString, defalutOWpayloadQuery} = require("./utils");
describe('Flight Search Page filters', () => {
    const waitForLowfareRequest = () => {
        cy.wait('@lowfareRequest', {timeout: 120000});
        cy.wait(2000);
    };

    const verifyCards = (selector, text) => {
        cy.get(selector).each(($element) => {
            cy.wrap($element).should('contain', text);
        });
    };
    const verifyFlightCards = (selector, text) => {
        cy.get(selector)
            .each(($div) => {
                cy.wrap($div).invoke('text').should('match', text);
            });
    };
    const verifyFlightCount = (query) => {
        cy.intercept('POST', '**/api/v2/offer/lowfare').as('lowfareRequest');
        const URL = `Flight/search?${jsonToQueryString(defalutOWpayloadQuery(...query))}`;
        cy.visit(URL);
        cy.wait(2000);
        waitForLowfareRequest();
    };

    it('Verify direct flights count', () => {
        verifyFlightCount(['direct', true]);
        verifyCards('span.empireFlight_stopvia', 'Direct');
    });

    it('Verify refundable flights count', () => {
        verifyFlightCount(['ref', true]);
        verifyCards('div.empireFlight_refund-text', 'Refundable');
    });

    it('Verify Emirates flights count', () => {
        verifyFlightCount(['airlines', 'EK']);
        verifyFlightCards('div.empireFlight_FlightNames', /^Emirates\s/);
    });

    it('Verify Saudi Arabian Airlines flights count', () => {
        verifyFlightCount(['airlines', 'SV']);
        verifyFlightCards('div.empireFlight_FlightNames', /^Saudia\s/);
    });

    it('Verify Saudi Arabian Airlines and Emirates flights count', () => {
        verifyFlightCount(['airlines', 'SV,EK']);
        verifyFlightCards('div.empireFlight_FlightNames', /^(Saudia|Emirates)\s/);
    });
});
