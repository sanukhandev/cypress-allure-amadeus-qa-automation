const {jsonToQueryString} = require("./utils");



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
    it('Verify cards and direct flights count', () => {
        cy.intercept('POST', '**/api/v2/offer/lowfare').as('lowfareRequest');
        const query = jsonToQueryString( {
            "dep1": "DXB",
            "ret1": "LON",
            "dtt1": "22-Jun-2023",
            "cl1": "Y",
            "triptype": 1,
            "adult": 1,
            "child": 0,
            "infant": 0,
            "direct": true,
            "baggage": false,
            "key": "OW",
            "airlines": "",
            "ref": false,
            "langcode": "EN",
            "curr": "AED",
            "ipc": false,
            "dep2": "",
            "ret2": "",
            "dtt2": "",
            "cl2": "Y",
            "dep3": "",
            "ret3": "",
            "dtt3": "",
            "cl3": ""
        })
        const URL = `Flight/search?${query}`
        cy.visit(URL);
        cy.wait(2000)
        cy.wait('@lowfareRequest', { multiple: true });
        cy.wait(2000)
        cy.get('span.empireFlight_stopvia')
            .each(($span) => {
                cy.wrap($span).should('contain', 'Direct');
            });

    })
    it('Verify cards and Refundable  flights count', () => {
        cy.intercept('POST', '**/api/v2/offer/lowfare').as('lowfareRequest');
        const query = jsonToQueryString( {
            "dep1": "DXB",
            "ret1": "LON",
            "dtt1": "22-Jun-2023",
            "cl1": "Y",
            "triptype": 1,
            "adult": 1,
            "child": 0,
            "infant": 0,
            "direct": false,
            "baggage": false,
            "key": "OW",
            "airlines": "",
            "ref": true,
            "langcode": "EN",
            "curr": "AED",
            "ipc": false,
            "dep2": "",
            "ret2": "",
            "dtt2": "",
            "cl2": "Y",
            "dep3": "",
            "ret3": "",
            "dtt3": "",
            "cl3": ""
        })
        const URL = `Flight/search?${query}`
        cy.visit(URL);
        cy.wait(2000)
        cy.wait('@lowfareRequest', { multiple: true });
        cy.wait(2000)
        cy.get('div.empireFlight_refund-text')
            .each(($span) => {
                cy.wrap($span).should('contain', 'Refundable');
            });

    })
    it('Verify cards and Emirates Flights  flights count', () => {
        cy.intercept('POST', '**/api/v2/offer/lowfare').as('lowfareRequest');
        const query = jsonToQueryString( {
            "dep1": "DXB",
            "ret1": "LON",
            "dtt1": "22-Jun-2023",
            "cl1": "Y",
            "triptype": 1,
            "adult": 1,
            "child": 0,
            "infant": 0,
            "direct": false,
            "baggage": false,
            "key": "OW",
            "airlines": "EK",
            "ref": false,
            "langcode": "EN",
            "curr": "AED",
            "ipc": false,
            "dep2": "",
            "ret2": "",
            "dtt2": "",
            "cl2": "Y",
            "dep3": "",
            "ret3": "",
            "dtt3": "",
            "cl3": ""
        })
        const URL = `Flight/search?${query}`
        cy.visit(URL);
        cy.wait(2000)
        cy.wait('@lowfareRequest', { multiple: true });
        cy.wait(2000)
        cy.get('div.empireFlight_FlightNames')
            .each(($div) => {
                cy.wrap($div).invoke('text').should('match', /^Emirates\s/);
            });

    })
    it('Verify cards and Saudi Arabian Airlines  Flights  flights count', () => {
        cy.intercept('POST', '**/api/v2/offer/lowfare').as('lowfareRequest');
        const query = jsonToQueryString( {
            "dep1": "DXB",
            "ret1": "LON",
            "dtt1": "22-Jun-2023",
            "cl1": "Y",
            "triptype": 1,
            "adult": 1,
            "child": 0,
            "infant": 0,
            "direct": false,
            "baggage": false,
            "key": "OW",
            "airlines": "SV",
            "ref": false,
            "langcode": "EN",
            "curr": "AED",
            "ipc": false,
            "dep2": "",
            "ret2": "",
            "dtt2": "",
            "cl2": "Y",
            "dep3": "",
            "ret3": "",
            "dtt3": "",
            "cl3": ""
        })
        const URL = `Flight/search?${query}`
        cy.visit(URL);
        cy.wait(2000)
        cy.wait('@lowfareRequest', { multiple: true });
        cy.wait(2000)
        cy.get('div.empireFlight_FlightNames')
            .each(($div) => {
                cy.wrap($div).invoke('text').should('match', /^Saudi Arabian Airlines\s/);
            });

    })
    it('Verify cards and Saudi Arabian Airlines And Emirates  Flights  flights count', () => {
        cy.intercept('POST', '**/api/v2/offer/lowfare').as('lowfareRequest');
        const query = jsonToQueryString( {
            "dep1": "DXB",
            "ret1": "LON",
            "dtt1": "22-Jun-2023",
            "cl1": "Y",
            "triptype": 1,
            "adult": 1,
            "child": 0,
            "infant": 0,
            "direct": false,
            "baggage": false,
            "key": "OW",
            "airlines": "SV,EK",
            "ref": false,
            "langcode": "EN",
            "curr": "AED",
            "ipc": false,
            "dep2": "",
            "ret2": "",
            "dtt2": "",
            "cl2": "Y",
            "dep3": "",
            "ret3": "",
            "dtt3": "",
            "cl3": ""
        })
        const URL = `Flight/search?${query}`
        cy.visit(URL);
        cy.wait(2000)
        cy.wait('@lowfareRequest', { multiple: true });
        cy.wait(2000)
        cy.get('div.empireFlight_FlightNames')
            .each(($div) => {
                cy.wrap($div).invoke('text')
                    .should('match', /^(Saudi Arabian Airlines|Emirates)\s/);
            });

    })
});
