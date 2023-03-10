const testData = require('../fixtures/testData.json');
const customerData = require('../fixtures/sampleCustomer.json');

// beforeEach(() => {
//     cy.wrap(Cypress.automation('remote:debugger:protocol', {
//         command: 'Network.clearBrowserCache',
//     }))
// });
testData.forEach(({scenario, type, origin, destination, departureDate, returnDate, Ariline}) => {
    const {Adults, Children, Infants} = customerData;
    describe(`${scenario} from ${origin} to ${destination}`, () => {
        it(scenario, () => {
            cy.visit('https://ngtest.aosuat.com/', {timeout: 10000});
            cy.wait(5000);
            cy.get("span").contains(type).click();
            cy.get('input#OwDropToOrigin').type(origin.split('-')[0].trim());
            cy.get('div.dropdown-menuRight.dropdown-menu.ng-star-inserted').filter(':visible').find('span').contains(origin.split('-')[1].trim()).click();
            cy.get('input#OwDropFromDepart').type(destination.split('-')[0].trim())
            cy.get('div.dropdown-menuRight.dropdown-menu.ng-star-inserted').filter(':visible').find('span').contains(destination.split('-')[1].trim()).click();
            cy.get('.empireFlight_searchdate-form').click()
                .find('span.p-datepicker-month').contains(departureDate.split(' ')[1])
                .parent().parent().parent().find('span').contains(departureDate.split(' ')[0]).click()
            cy.get("button.empireFlight_search-button").click();
            cy.wait(10000);
            cy.get("div.empireFlight_mobBoxShow").get("div.empireFlight_FlightNames > h4").contains(Ariline.split('-')[0].trim())
                .parent()
                .parent()
                .parent()
                .parent()
                .parent()
                .parent()
                .parent()
                .parent()
                .parent()
                .parent().find(".empireFlight_button").contains('Select flight').click();
            cy.get("span.flightDetailText").contains('Book Now').click();
            cy.wait(10000)
            cy.get('div.empireFlight_TravelerFormDetails').find('ng-select[formcontrolname="Title"]').click()
            cy.get('div.ng-dropdown-panel-items').find('div.ng-option').contains(Adults[0].title).click()
            cy.get('input[formcontrolname="FirstName"]').type(Adults[0].first)
            cy.get('input[formcontrolname="LastName"]').type(Adults[0].last)
            cy.get('p-inputmask[formcontrolname="DateOfBirth"]').find('input').type(Adults[0].DoB)
            cy.get('ng-select[formcontrolname="DocumentType"]').click().find('div.ng-dropdown-panel-items').find('div.ng-option').contains(Adults[0].documentType).click()
            cy.get('input[formcontrolname="DocumentNumber"]').type(Adults[0].documentNumber)
            cy.get('ng-select[formcontrolname="DocumentIssuingCountry"]').click().find('div.ng-dropdown-panel-items').find('div.ng-option').contains(Adults[0].issuingCountry).click()
            cy.get('ng-select[formcontrolname="Nationality"]').click().find('div.ng-dropdown-panel-items').find('div.ng-option').contains(Adults[0].nationality).click()
            cy.get('p-inputmask[formcontrolname="DocumentExpiryDate"]').find('input').type('01/01/2028')
            cy.get('input[formcontrolname="EmailAddress"]').type(Adults[0].email)
            cy.get('ng-select[formcontrolname="phne_code"]').click().find('div.ng-dropdown-panel-items').find('div.ng-option').contains(Adults[0].countryCode).click()
            cy.get('input[formcontrolname="MobileNo"]').type(Adults[0].phone)
            cy.get('button').find('div').contains('Continue to payment').click()
            cy.get('div').contains('Proceed to Pay').click()
            cy.wait(20000)
            cy.origin('https://sbcheckout.payfort.com/', () => {
                cy.get('input#cardNoInput').type('4005550000000001')
                cy.get('input#chNameInput').type('Test')
                cy.get('input#expDateInput').type('05/25')
                cy.get('input#cvvInput').type('123')
                cy.get('button').contains('Pay').click()
            })
            cy.wait(30000)
            cy.get('div').contains('Your booking is Confirmed').should('be.visible')


        });
    });

})



