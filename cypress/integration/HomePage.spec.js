import HomePage from "../POM/HomePage";


describe("Home Page", () => {
    const homePage = new HomePage();

    beforeEach(() => {
        cy.visit("/flight?mgcc=IN");
        cy.wait(5000); //TODO  dynamic waits based on elements or network responses
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
        cy.allure().startStep('Advance Search is visible');
        homePage.getAdvancedSearchButton().should('be.visible');
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
        cy.allure().startStep("Verify 'Round Trip' tab is active");
        homePage.getRoundTripTab().click();
        homePage.getRoundTripTab().should('have.class', 'mdc-tab--active');
        cy.allure().endStep();

        // Test for 'One Way' tab
        cy.allure().startStep("Verify 'One Way' tab is active");
        homePage.clickOneWayTab();
        homePage.getOneWayTab().should('have.class', 'mdc-tab--active');
        cy.allure().endStep();

        // Test for 'Multi City (3 Segment)' tab
        cy.allure().startStep("Verify 'Multi City (3 Segment)' tab is active");
        homePage.clickMultiCity3SegmentTab();
        homePage.getMultiCity3SegmentTab().should('have.class', 'mdc-tab--active');
        cy.allure().endStep();

        // Test for 'Multi City' tab
        cy.allure().startStep("Verify 'Multi City' tab is active");
        homePage.clickMultiCityTab();
        homePage.getMultiCityTab().should('have.class', 'mdc-tab--active');
        cy.allure().endStep();
    });


    it('should validate round trip search components', () => {
        cy.allure().startStep("Click and verify 'Round Trip' tab");
        homePage.getRoundTripTab().click();
        homePage.getRoundTripTab().should('have.class', 'mdc-tab--active');
        cy.allure().endStep();

        cy.allure().startStep("Verify 'Origin' RT input is visible");
        homePage.getOriginInput().should('be.visible');
        cy.allure().endStep();

        cy.allure().startStep("Verify 'Destination' input is visible");
        homePage.getDestinationInput().should('be.visible');
        cy.allure().endStep();

        // Uncomment and use these steps if necessary
        cy.allure().startStep("Verify 'Departure Date' is visible");
        homePage.getDepartureDate().should('be.visible');
        cy.allure().endStep();

        cy.allure().startStep("Verify 'Return Date' is visible");
        homePage.getReturnDate().should('be.visible');
        cy.allure().endStep();

        cy.allure().startStep("Verify 'Traveler and Class' panel is visible");
        homePage.getTravelerAndClassPanel().should('be.visible');
        cy.allure().endStep();
    });


    it('should validate one way search components', () => {
        cy.allure().startStep("Click and verify 'One Way' tab");
        homePage.clickOneWayTab();
        homePage.getOneWayTab().should('have.class', 'mdc-tab--active');
        cy.allure().endStep();

        cy.allure().startStep("Verify 'Origin' OW input is visible");
        homePage.getOriginInput().should('be.visible');
        cy.allure().endStep();

        cy.allure().startStep("Verify 'Destination' input is visible");
        homePage.getDestinationInput().should('be.visible');
        cy.allure().endStep();

        // Uncomment and use this step if necessary
        cy.allure().startStep("Verify 'Departure Date' is visible");
        homePage.getDepartureDate().click().should('be.visible');
        cy.allure().endStep();

        cy.allure().startStep("Verify 'Traveler and Class' panel is visible");
        homePage.getTravelerAndClassPanel().should('be.visible');
        cy.allure().endStep();
    });



    it('should validate multi 3 city search components', () => {
        cy.allure().startStep("Click and verify 'Multi City (3 Segment)' tab");
        homePage.clickMultiCity3SegmentTab();
        homePage.getMultiCity3SegmentTab().should('have.class', 'mdc-tab--active');
        cy.allure().endStep();

        cy.allure().startStep("Validate inputs for multi-city 3segment search");
        homePage.validateInputs(2);
        cy.allure().endStep();

        cy.allure().startStep("Verify 'Traveler and Class' panel is visible");
        homePage.getTravelerAndClassPanel().should('be.visible');
        cy.allure().endStep();


    });

    it('should validate multi-city search components', () => {
        cy.allure().startStep("Click and verify 'Multi City' tab");
        homePage.clickMultiCityTab();
        homePage.getMultiCityTab().should('have.class', 'mdc-tab--active');
        cy.allure().endStep();

        homePage.getAddMoreButton().click()
        cy.allure().startStep("Validate inputs for multi-city search");
        homePage.validateInputs(3);
        cy.allure().endStep();

        cy.allure().startStep("Verify 'Traveler and Class' panel is visible");
        homePage.getTravelerAndClassPanel().should('be.visible');
        cy.allure().endStep();


    });


    it('should be able click and validate advance search options', () => {

        cy.allure().startStep("Click on Advance Search button");
        homePage.getAdvancedSearchButton().click();
        cy.allure().endStep();

        cy.allure().startStep("Validate Advance Search options");
        homePage.validateAdvanceSearchOptions();
        cy.allure().endStep();

        cy.allure().startStep("Click on Advance Search button");
        homePage.getAdvancedSearchButton().click();
        cy.allure().endStep();
    });


    it('should input DXB and select Dubai International Airport from dropdown', () => {
        const homePage = new HomePage();
        cy.allure().startStep("Click Round Trip Tab input DXB and select Dubai International Airport from dropdown");
        homePage.setOrigin('DXB');
        homePage.setDestination('LON');
        cy.allure().endStep();

        cy.allure().startStep("Click One Way Tab input DXB and select Dubai International Airport from dropdown");

        homePage.clickOneWayTab();
        homePage.setOrigin('DXB');
        homePage.setDestination('LON');

        cy.allure().endStep();

        cy.allure().startStep("Click Multi City Tab input DXB and select Dubai International Airport from dropdown");

        homePage.clickMultiCityTab();
        homePage.setMCOrigin('DXB', 0);
        homePage.setMCDestination('LON', 0);
        homePage.setMCOrigin('DXB', 1);
        homePage.setMCDestination('LON', 1);

        homePage.getAddMoreButton().click()
        homePage.setMCOrigin('DXB', 2);
        homePage.setMCDestination('LON', 2);

        cy.allure().endStep();

        cy.allure().startStep("Click Multi City 3 Segment Tab input DXB and select Dubai International Airport from dropdown");

        homePage.clickMultiCity3SegmentTab();
        homePage.setMCOrigin('DXB', 0);
        homePage.setMCDestination('LON', 0);
        homePage.setMCOrigin('DXB', 1);
        homePage.setMCDestination('LON', 1);

        cy.allure().endStep();
    });

    it('should able to select date inputs', () => {
        cy.allure().startStep("Select Date Range for round trip");
        homePage.selectDateRange(10,15);
        cy.allure().endStep();
        cy.allure().startStep("Select Departure Date for one way");
        homePage.clickOneWayTab();
        homePage.selectDate(10);
        cy.allure().endStep();
        cy.allure().startStep("Select Departure Date for multi city");
        homePage.clickMultiCityTab();
        homePage.selectMCDate(10, 1);
        cy.allure().endStep();
        cy.allure().startStep("Select Departure Date for multi city 3 segment");
        homePage.clickMultiCity3SegmentTab();
        homePage.selectMCDate(10, 2);
        cy.allure().endStep();


    });



});
