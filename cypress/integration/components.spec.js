const {jsonToQueryString, defalutOWpayloadQuery} = require("./utils");
describe('One Way booking flow', () => {
    const getIndexPage = (query) => {
        cy.visit('/?mgcc=IN');
        cy.wait(2000);
    }

    beforeEach(() => {
        getIndexPage([]);
    })
    const tabLabels = [
        'Round Trip',
        'One Way',
        'Multi City (3 Segment)',
        'Multi City'
    ];


    it('should load the index page and components are visible ', () => {
        cy.get('div.empireF_searchHead.empireE_searchHead')
            .find('button')
            .then((tabButtons) => {
                if (tabButtons.length > 0) {
                    // Iterate over each button
                    cy.get('div.empireF_searchHead.empireE_searchHead')
                        .find('button').contains('Flights').click()
                    cy.get('div.empireF_searchHead.empireE_searchHead')
                        .find('button').should('have.class', 'active');
                    cy.get('.empireFlight_searchform-trips').should('be.visible');
                    tabLabels.forEach(label => {
                        cy.get('mat-tab-header').contains(label).should('be.visible');
                    });
                }
            });
    });


})