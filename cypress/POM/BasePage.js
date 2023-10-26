const {jsonToQueryString} = require("../integration/utils");

class BasePage {
     getFlights = query => {
        cy.visit(`Flight/search?${jsonToQueryString(query)}`);
        cy.wait(2000);
    };

    find = (selector, options = {}) => {
        return cy.get(selector, options);
    }

    fillNgSelect = (controlName, value) => {
        cy.root().then($root => { // Use cy.root() instead of body to respect context
            if ($root.find(`ng-select[formcontrolname="${controlName}"]`).length) {
                cy.get(`ng-select[formcontrolname="${controlName}"]`).click();
                cy.get('div.ng-dropdown-panel-items')
                    .find('div.ng-option')
                    .should('be.visible')
                    .contains(value).click();
            } else {
                cy.log(`ng-select with form control name "${controlName}" is not present.`);
            }
        });
    };

     setDate = (containerClass, dayControl, monthControl, yearControl, day, month, year) => {
        const selectDate = (name, value) => {
            cy.get(`div.${containerClass}`).find(`ng-select[formcontrolname="${name}"]`).click();
            cy.get('div.ng-dropdown-panel-items').find('div.ng-option').contains(value).click();
        };
        cy.get(`div.${containerClass}`).then($e => {
            if ($e.is(':visible')) {
                selectDate(dayControl, day);
                selectDate(monthControl, month);
                selectDate(yearControl, year);
            }
        });
    };
    fillTextField(selector, value) {
        cy.get(selector).type(value);
    }

}


module.exports = BasePage;