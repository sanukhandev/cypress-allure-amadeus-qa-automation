const testData = require('../fixtures/testData.json');
const customerData = require('../fixtures/sampleCustomer.json');
const {jsonToQueryString} = require("./utils");
const setDate = (containerClass, dayControl, monthControl, yearControl, day, month, year) => {
    // Set day
    cy.get(`div.${containerClass}`).find(`ng-select[formcontrolname="${dayControl}"]`).click();
    cy.get('div.ng-dropdown-panel-items').find('div.ng-option').contains(day).click();

    // Set month
    cy.get(`div.${containerClass}`).find(`ng-select[formcontrolname="${monthControl}"]`).click();
    cy.get('div.ng-dropdown-panel-items').find('div.ng-option').contains(month).click();

    // Set year
    cy.get(`div.${containerClass}`).find(`ng-select[formcontrolname="${yearControl}"]`).click();
    cy.get('div.ng-dropdown-panel-items').find('div.ng-option').contains(year).click();
}

for (const testDatum of testData) {
    const {scenario, ...rest} = testDatum;
    let query = jsonToQueryString(rest)
    const URL = `Flight/search?${query}`

    describe(scenario, () => {



        it('should search for one way flight', () => {
            cy.visit(URL);
            cy.intercept('*', () => {
            }).as('networkRequests');
            cy.wait('@networkRequests', {timeout: 30000});
            cy.wait(2000);
            cy.get('.empireFlight_SortBy').should('be.visible');
            cy.wait(2000);
            if (rest.key === 'OW' || rest.key === 'IRT' || rest.key === 'NMC') {
                cy.get('.empireFlight_ListingBodycontainer').contains('Select').click({force: true})
                cy.wait('@networkRequests', {timeout: 30000});
            } else {
                cy.get('.empireFlight_McSummaryTotalPrice').contains('Book Now').click({force: true})
                cy.wait('@networkRequests', {timeout: 30000});
            }

            // cy.get('button').contains('Book Now').click()
            // cy.wait(2000);
            cy.get('.empireFlight_DetailsBody').should('be.visible');
            cy.get('.flightDetailText').contains('Book Now').click({force: true})
            const {Adults} = customerData;
            cy.wait('@networkRequests', {timeout: 30000});
            cy.wait(2000);
            cy.get('div.empireF_TravelerFormBody').find('ng-select[formcontrolname="Title"]').click()
            cy.get('div.ng-dropdown-panel-items').find('div.ng-option').contains(Adults[0].title).click()

            cy.get('input[formcontrolname="FirstName"]').type(Adults[0].first)
            cy.get('input[formcontrolname="LastName"]').type(Adults[0].last)
            setDate('empireF_travelerDateofBirth', 'BirthDate', 'BirthMonth', 'BirthYear', '24', 'September', '1993');

            cy.get('ng-select[formcontrolname="DocumentType"]').click().find('div.ng-dropdown-panel-items').find('div.ng-option').contains(Adults[0].documentType).click()
            cy.get('input[formcontrolname="DocumentNumber"]').type(Adults[0].documentNumber)
            cy.get('ng-select[formcontrolname="DocumentIssuingCountry"]').click().find('div.ng-dropdown-panel-items').find('div.ng-option').contains(Adults[0].issuingCountry).click()
            cy.get('ng-select[formcontrolname="Nationality"]').click().find('div.ng-dropdown-panel-items').find('div.ng-option').contains(Adults[0].nationality).click()
            setDate('empireF_pasPortInfo', 'DocumentIssueDay', 'DocumentIssueMonth', 'DocumentIssueYear', '11', 'January', '2018');
            setDate('empireF_pasPortInfo', 'DocumentExpiryDay', 'DocumentExpiryMonth', 'DocumentExpiryYear', '10', 'January', '2028');
            cy.get('input[formcontrolname="EmailAddress"]').type(Adults[0].email)
            cy.get('ng-select[formcontrolname="phne_code"]').click().find('div.ng-dropdown-panel-items').find('div.ng-option').contains(Adults[0].countryCode).click()
            cy.get('input[formcontrolname="MobileNo"]').type(Adults[0].phone)
            cy.get('button').find('div').contains('Continue to payment').click()
            cy.wait('@networkRequests', {timeout: 30000});
            cy.wait(2000);
            cy.get('div').contains('Proceed to Pay').click()
            cy.wait(30000)
            cy.wait('@networkRequests', {timeout: 30000});
            cy.origin('https://sbcheckout.payfort.com/', () => {
                cy.get('input#cardNoInput').type('4005550000000001')
                cy.get('input#chNameInput').type('Test')
                cy.get('input#expDateInput').type('05/25')
                cy.get('input#cvvInput').type('123')
                cy.get('button').contains('Pay').click()
            })
            cy.wait(30000)
            cy.wait(30000)
            cy.get('div').contains('Booking Summary').should('be.visible')
        });
    });
}

