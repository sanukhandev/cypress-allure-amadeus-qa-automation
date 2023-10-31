import HomePage from "../POM/HomePage";

describe("Home Page", () => {
    const homePage = new HomePage();

    beforeEach(() => {
        cy.visit("/flight?mgcc=IN");
        cy.wait(5000); // Consider dynamic waits based on elements or network responses
    });

    it("should display all key sections of the home page", () => {
        cy.allure().feature('Home Page');
        cy.allure().story('Check Home Page Components');
        cy.allure().startStep('Check Header');
        homePage.getHeader().should("be.visible");
        cy.allure().endStep();
        cy.allure().startStep('Check Footer');
        homePage.getFooter().should("be.visible");
        cy.allure().endStep();
        cy.allure().startStep('Check Flight Search Section');
        homePage.getFlightSearchSection().should("be.visible");
        cy.allure().endStep();
    });

    it("Should swtich tabs with button click", () => {
        cy.allure().feature('Home Page');
        cy.allure().story('Check Home Page Components');
        cy.allure().startStep('Check Flight Button');
        homePage.getFlightButton().click();
        cy.allure().endStep();
        cy.allure().startStep('Check Hotel Button');
        homePage.getHotelButton().click();
        cy.allure().endStep();
        cy.allure().startStep('Check Sports Button');
        homePage.getSportsButton().click();
        cy.allure().endStep();
    })


    it("should switch between all tabs and verify each is active", () => {
        // Test for 'Round Trip' tab
        homePage.getRoundTripTab().click();
        homePage.getRoundTripTab().should('have.class', 'mdc-tab--active');

        // Test for 'One Way' tab
        homePage.clickOneWayTab();
        homePage.getOneWayTab().should('have.class', 'mdc-tab--active');

        // Test for 'Multi City (3 Segment)' tab
        homePage.clickMultiCity3SegmentTab();
        homePage.getMultiCity3SegmentTab().should('have.class', 'mdc-tab--active');

        // Test for 'Multi City' tab
        homePage.clickMultiCityTab();
        homePage.getMultiCityTab().should('have.class', 'mdc-tab--active');
    });

    it('should validate round trip serach components', () => {
        homePage.getRoundTripTab().click();
        homePage.getRoundTripTab().should('have.class', 'mdc-tab--active');
        homePage.getOriginInput().should('be.visible');
        homePage.getDestinationInput().should('be.visible');
        // homePage.getDepartureDate().should('be.visible');
        // homePage.getReturnDate().should('be.visible');
        homePage.getTravelerAndClassPanel().should('be.visible');
    });

    it('should validate one way serach components', () => {
        homePage.clickOneWayTab();
        homePage.getOneWayTab().should('have.class', 'mdc-tab--active');
        homePage.getOriginInput().should('be.visible');
        homePage.getDestinationInput().should('be.visible');
        // homePage.getDepartureDate().should('be.visible');
        homePage.getTravelerAndClassPanel().should('be.visible');
    });


    it('should validate multi 3 city serach components', () => {
        homePage.clickMultiCity3SegmentTab();
        homePage.getMultiCity3SegmentTab().should('have.class', 'mdc-tab--active');
        homePage.validateInputs(2)

        homePage.getTravelerAndClassPanel().should('be.visible');
        homePage.getAddMoreButton().should('be.visible');
    });

    it('should validate multi city serach components', () => {
        homePage.clickMultiCityTab();
        homePage.getMultiCityTab().should('have.class', 'mdc-tab--active');
        homePage.validateInputs(2)
        homePage.getTravelerAndClassPanel().should('be.visible');
        homePage.getAddMoreButton().should('be.visible');
    });


});
