import BasePage from "./BasePage";
import 'cypress-real-events/support';

class HomePage extends BasePage {

    constructor() {
        super();
        this.selector = 'empire-advanced-search';

    }


    getHeader() {
        return cy.get("header.empireHeadheader");
    }

    getFooter() {
        return cy.get("footer.temp3-footer-head");
    }

    getFlightSearchSection() {
        return cy.get("div.empireFlight_searchform-trips-tabs");
    }

    getEventHeading(headingText) {
        return cy.get('h1.event_heading').contains(headingText);
    }

    getGenericHeading(headingText) {
        return cy.get('h1').contains(headingText);
    }


    getFlightButton() {
        return cy.get('.empireF_tripFlight').first();
    }

    getHotelButton() {
        return cy.get('.empireF_tripHotel').first();
    }

    getSportsButton() {
        // Assuming the sports button has the same class as flight
        return cy.get('.empireF_tripFlight').eq(1);
    }

    getRoundTripTab() {
        return cy.get('div.mat-mdc-tab-labels').contains('span', 'Round Trip').closest('.mdc-tab');
    }


    getOneWayTab() {
        return cy.get('div.mat-mdc-tab-labels').contains('span', 'One Way').closest('.mdc-tab');
    }

    getMultiCity3SegmentTab() {
        return cy.get('div.mat-mdc-tab-labels').find('span').filter((index, el) => {
            return el.textContent.trim() === 'Multi City (3 Segment)';
        }).closest('.mdc-tab');
    }

    getMultiCityTab() {
        return cy.get('div.mat-mdc-tab-labels').find('span').filter((index, el) => {
            return el.textContent.trim() === 'Multi City';
        }).closest('.mdc-tab');
    }

    // Methods to click on the tabs
    clickRoundTripTab() {
        this.getRoundTripTab().click();
    }

    clickOneWayTab() {
        this.getOneWayTab().click();
    }

    clickMultiCity3SegmentTab() {
        this.getMultiCity3SegmentTab().click({multiple: true});
    }

    clickMultiCityTab() {
        this.getMultiCityTab().click({multiple: true});
    }

    getOriginInput() {
        return cy.get('.empireFlight_origin input')
    }

    getDestinationInput() {
        return cy.get('.empireFlight_depart input')
    }

    getDepartureDate() {
        return cy.get('label.empireFlight_searchdate-form')
    }

    getReturnDate() {
        return cy.get('label.empireFlight_searchdate-to')
    }

    getMCOriginInput(index = 0) {
        return cy.get(`input#DropToOrigin${index}`)
    }


    getMCDestinationInput(index = 0) {
        return cy.get(`input#DropFromDepart${index}`)
    }


    getMCDateInput(index = 0) {
        return cy.get(`input#calenderDynamic${index}`)
    }

    getTravelerAndClassPanel() {
        return cy.get('.empireF_searchtravellerWrapper');
    }

    getAddMoreButton() {
        return cy.get('span.empireH_addMoreSearch');
    }

    validateInputs(length) {
        for (let i = 0; i < length; i++) {
            this.getMCDateInput(i).should('be.visible');
            this.getMCOriginInput(i).should('be.visible');
            this.getMCDestinationInput(i).should('be.visible');
        }

    }

    getAdvancedSearchButton() {
        return cy.get('a.AdvSearchOpt-btn');
    }

    getFlexibleDatesCheckbox() {
        return cy.get('#mat-mdc-checkbox-1');
    }

    getPreferredAirlineDropdown() {
        return cy.get('ng-select.empireF_AdvSearOpt');
    }

    getBaggageOnlyCheckbox() {
        return cy.get('#mat-mdc-checkbox-4');
    }

    getDirectFlightsCheckbox() {
        return cy.get('#mat-mdc-checkbox-2');
    }

    getRefundableCheckbox() {
        return cy.get('#mat-mdc-checkbox-3');
    }

    validateAdvanceSearchOptions() {
        this.getFlexibleDatesCheckbox().should('be.visible');
        this.getPreferredAirlineDropdown().should('be.visible');
        this.getBaggageOnlyCheckbox().should('be.visible');
        this.getDirectFlightsCheckbox().should('be.visible');
        this.getRefundableCheckbox().should('be.visible');
    }

    getDropDown(selector = 'div.dropdown-menu.show') {
        return cy.get(selector);
    }


    setTypeAheadInput(fieldInput, value) {
        fieldInput.type(value);
        this.getDropDown().contains('.dropdown-item', value).should('be.visible').click();
    }

    setOrigin(origin) {
        cy.allure().startStep(`Click on Origin Input and type '${origin}'`);
        this.setTypeAheadInput(this.getOriginInput(), origin);
        cy.allure().endStep();
    }

    setDestination(destination) {
        cy.allure().startStep(`Click on Destination Input and type '${destination}'`);
        this.setTypeAheadInput(this.getDestinationInput(), destination);
        cy.allure().endStep();
    }

    setMCOrigin(origin, index = 0) {
        cy.allure().startStep(`Click on Origin Input and type '${origin}'`);
        this.setTypeAheadInput(this.getMCOriginInput(index), origin);
        cy.allure().endStep();
    }

    setMCDestination(destination, index = 0) {
        cy.allure().startStep(`Click on Destination Input and type '${destination}'`);
        this.setTypeAheadInput(this.getMCDestinationInput(index), destination);
        cy.allure().endStep();
    }

    selectDateRange(departureDate, arrivalDate) {
        this.getDepartureDate().click();
        cy.get('table.p-datepicker-calendar').first().contains(departureDate).click();
        this.getReturnDate().click();
        cy.get('table.p-datepicker-calendar').last().contains(arrivalDate).click();
    }

    selectDate(date) {
        this.getDepartureDate().click();
        cy.get('table.p-datepicker-calendar').last().contains(date).click();
    }

    selectMCDate(date, index = 0) {
        cy.get('.empireFlight_MCsearchdate-form').each(($el, index, $list) => {
            cy.wrap($el).click();
            cy.get('table.p-datepicker-calendar').last().contains(date).click();
            date+=2;
        });
    }


}

export default HomePage;
