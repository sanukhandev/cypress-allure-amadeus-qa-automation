import RTflightSearchPage from "../POM/RTflightSearchPage";

describe('Flight Search RT', () => {

    const rtFlightSearch = new RTflightSearchPage()

    // it('should make Search rt WITH pax', () => {
    //
    //     cy.allure().startStep("Make search with one Pax")
    //     rtFlightSearch.makeSearchWithPax("1","0","0")
    //     cy.allure().startStep(" should be able to click and validate advance search options")
    //     rtFlightSearch.isResponseVisible();
    //     cy.allure().endStep();
    //     cy.allure().endStep();
    //     cy.allure().startStep("Make search with two Pax")
    //     rtFlightSearch.makeSearchWithPax("2","0","0")
    //     cy.allure().startStep(" should be able to click and validate advance search options")
    //     rtFlightSearch.isResponseVisible();
    //     cy.allure().endStep();
    //     cy.allure().endStep();
    //     cy.allure().startStep("Make search with three Pax")
    //     rtFlightSearch.makeSearchWithPax("3","0","0")
    //     cy.allure().startStep(" should be able to click and validate advance search options")
    //     rtFlightSearch.isResponseVisible();
    //     cy.allure().endStep();
    //     cy.allure().endStep();
    //     cy.allure().startStep("Make search with 1 ADULT 1 CHILD Pax")
    //     rtFlightSearch.makeSearchWithPax("1","1","0")
    //     cy.allure().startStep(" should be able to click and validate advance search options")
    //     rtFlightSearch.isResponseVisible();
    //     cy.allure().endStep();
    //     cy.allure().endStep();
    //     cy.allure().startStep("Make search with 1 ADULT 1 INFANT Pax")
    //     rtFlightSearch.makeSearchWithPax("1","0","1")
    //     cy.allure().startStep(" should be able to click and validate advance search options")
    //     rtFlightSearch.isResponseVisible();
    //     cy.allure().endStep();
    //     cy.allure().endStep();
    //     cy.allure().startStep("Make search with 1 ADULT 1 CHILD 1 INFANT Pax")
    //     rtFlightSearch.makeSearchWithPax("1","1","1")
    //     cy.allure().startStep(" should be able to click and validate advance search options")
    //     rtFlightSearch.isResponseVisible();
    //     cy.allure().endStep();
    //     cy.allure().endStep();
    //
    //
    // });
    //
    // it("Should search with specific airline", () => {
    //     cy.allure().startStep("Search with specific  EK")
    //     rtFlightSearch.makeSearchWithAirlines("EK")
    //     cy.allure().startStep(" should be able to click and validate advance search options")
    //     rtFlightSearch.isResponseVisible();
    //     cy.allure().endStep();
    //     cy.allure().endStep();
    //     cy.allure().startStep("Search with specific airline EY")
    //     rtFlightSearch.makeSearchWithAirlines("EY")
    //     cy.allure().startStep(" should be able to click and validate advance search options")
    //     rtFlightSearch.isResponseVisible();
    //     cy.allure().endStep();
    //     cy.allure().endStep();
    //     cy.allure().startStep("Search with specific airline QR")
    //     rtFlightSearch.makeSearchWithAirlines("QR")
    //     cy.allure().startStep(" should be able to click and validate advance search options")
    //     rtFlightSearch.isResponseVisible();
    //     cy.allure().endStep();
    //     cy.allure().endStep();
    // })


    it('should validate components RT 1 PAX', () => {
        cy.allure().startStep("Make search with one Pax")
        rtFlightSearch.makeSearchWithPax("1","0","0")
       cy.allure().endStep()
    });


})