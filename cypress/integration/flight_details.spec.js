const {jsonToQueryString, defalutOWpayloadQuery} = require("./utils");

describe('Flight Search Page flight details', () => {
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

    beforeEach(() => {
        getFlightResponsePage(['airlines', 'EK']);
    })
    it('should open flight Details and verify data', () => {
        // Click on 'Select' within the listing container
        cy.get('.empireFlight_ListingBodycontainer')
            .contains('Select')
            .click({ force: true });
        cy.wait(2000);
        // Check if the flight details are visible
        cy.get('.empireFlight_DetailsBody').should('be.visible');

        // Verify each tab label and click on them
        const tabs = [' Fare Options ',' Flight Itinerary ', ' Baggage ', ' Fare Breakup '];

        tabs.forEach(tab => {
            cy.get('.mat-tab-label')
                .contains(tab)
                .should('be.visible')
                .click();

            if(tab === ' Fare Options ') {
                cy.get('.empireFlight_ValueCardWarapperSame').find('p').contains('Fare Options').should('be.visible');
            }
            if(tab === ' Flight Itinerary ') {
                cy.get('div.empireFlight_ItWrapper').should('be.visible');
            }
            if(tab === ' Baggage ') {
                cy.get('div.empireF_bagWrapper').should('be.visible');
            }
            if(tab === ' Fare Breakup ') {
                cy.get('div.empireF_lightFareBreakup').should('be.visible');
            }


        });
    });

})