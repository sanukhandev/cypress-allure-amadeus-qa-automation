describe('Flight Page', () => {
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


});
