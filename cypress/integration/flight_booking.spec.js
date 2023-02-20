const testData = require('../fixtures/testData.json');
describe('Dynamic Test Cases found:'+testData.length, () => {
   testData.forEach(({scenario, type, origin, destination, departureDate}) => {
       it(scenario, () => {
           cy.visit('https://ngtest.aosuat.com/', {timeout: 10000});
           cy.wait(5000);
           cy.get("span").contains(type).click();
           cy.get('input#OwDropToOrigin').type(origin.split('-')[0].trim());
           cy.get('div.dropdown-menuRight.dropdown-menu.ng-star-inserted').filter(':visible').get('span').contains(origin.split('-')[1].trim()).click();
           cy.get('input#OwDropFromDepart').type(destination.split('-')[0].trim())
           cy.get('div.dropdown-menuRight.dropdown-menu.ng-star-inserted').filter(':visible').find('span').contains(destination.split('-')[1].trim()).click();
           cy.get("input#calenderDynamic0").click();
           cy.get("div.p-datepicker-multiple-month").get('span').contains(departureDate.split(' ')[1]).click();
           cy.get("button.empireFlight_search-button").click();
           cy.wait(10000);
           cy.get("empire-ow-card").get("div.empireFlight_listing-card").first().get("span").contains('Select flight').click();
           cy.get("div.temp_filterMobileBody").find("span.flightDetailText").contains('Book Now').click();
           cy.wait(10000)
           cy.get('div.empireFlight_TravelerFormDetails').find('ng-select[formcontrolname="Title"]').click()
           cy.get('div.ng-dropdown-panel-items').find('div.ng-option').contains('Mr').click()
       });

   })
});
