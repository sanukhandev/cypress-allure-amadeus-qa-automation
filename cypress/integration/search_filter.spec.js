const {jsonToQueryString, defalutOWpayloadQuery} = require("./utils");
describe('Flight Page', () => {
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
    it('Verify Advanced search options', () => {
        // Go to the '/flight' page
        cy.visit('/flight');
        cy.intercept('*', () => {
        }).as('networkRequests');
        cy.wait('@networkRequests', {timeout: 30000});
        cy.wait(2000);
        // Verify the existence of the hyperlink with the correct text and class
        cy.contains('[role="button"].AdvSearchOpt-btn', 'Advanced search options')
            .click();

        // After clicking, a div with the specific class should be visible, with 4 checkboxes inside
        cy.get('div.empireFlight_AdvSearMobOpt.collapse.show')
            .should('be.visible')
            .find('mat-checkbox')
            .should('have.length', 3);
        cy.get('div.empireFlight_AdvSearMobOpt.collapse.show mat-checkbox .mat-checkbox-label')
            .should(($labels) => {
                // Check the text of the labels
                expect($labels).to.have.length(3);
                expect($labels.eq(0).text().trim()).to.equal('Baggage only');
                expect($labels.eq(1).text().trim()).to.equal('Direct Flights');
                expect($labels.eq(2).text().trim()).to.equal('Refundable');
            });
    });
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
        verifyFlightCards('div.empireFlight_FlightNames', /^Saudi Arabian Airlines\s/);
    });

    it('Verify Saudi Arabian Airlines and Emirates flights count', () => {
        verifyFlightCount(['airlines', 'SV,EK']);
        verifyFlightCards('div.empireFlight_FlightNames', /^(Saudi Arabian Airlines|Emirates)\s/);
    });
});
