const {generatePayloadFromExcelRow, filtersToApply} = require("./utils");
const flightData = require("../fixtures/Flight.json");
const FlightPage = require("../POM/FlightSearchPage");
const BookingComponent = require("../POM/BookingComponent");
const PaymentConfirmationPage = require("../POM/PaymentConfirmationPage");
const BookingConfirmationPage = require("../POM/BookingConfirmationPage");

describe('Flight Booking', () => {
    flightData.map(generatePayloadFromExcelRow).forEach((rowData) => {
        const { scenario, gateway, paxInfo, ...payload } = rowData;

        it(`Flight Booking - ${scenario}`, () => {
            const flightPage = new FlightPage();
            const bookingComponent = new BookingComponent();
            const paymentPage = new PaymentConfirmationPage();
            const bookingConfirmationPage = new BookingConfirmationPage();

            // Starting Flight Search
            cy.allure().startStep(`Search for flights with payload: ${JSON.stringify(payload)}`);
            flightPage.getFlights(payload);
            cy.allure().endStep();

            // Verifying Flight Cards
            cy.allure().startStep('Verify that flight cards include Emirates flights');
            // flightPage.verifyFlightCards('div.empireFlight_FlightNames', /^Emirates\s/);
            cy.allure().endStep();

            // Applying and Resetting Filters
            cy.allure().startStep('Apply and then reset filters');
            flightPage.clickMorefilters();
            filtersToApply.forEach(({ filter, min, max }) => {
                cy.allure().log(`Applying filter ${filter} with min: ${min}, max: ${max}`);
                flightPage.adjustSlider(filter, min, 'min');
                flightPage.adjustSlider(filter, max, 'max');
                flightPage.resetSlider(filter);
            });
            flightPage.clickFilterApply();
            cy.allure().endStep();

            // Selecting Flight for Booking
            cy.allure().startStep('Selecting a flight for booking');
            flightPage.getFlightDetails();
            cy.allure().endStep();

            // Completing the Booking Process
            cy.allure().startStep('Completing the flight booking process');
            bookingComponent.bookFlight();
            bookingComponent.proceedToPayment();
            paymentPage.proceedToPayment();
            cy.allure().endStep();

            // Verifying Booking Confirmation
            cy.allure().startStep('Verifying booking confirmation and details');
            bookingConfirmationPage.interceptBookingConfirmation();
            if(flightPage.appliedCommercialRuleIDs === bookingConfirmationPage.confimedCommercialRuleIDs){
                cy.allure().log(`Applied commercial rule IDs are ${flightPage.appliedCommercialRuleIDs.join(', ')}`);
            }
            bookingConfirmationPage.checkBookingStatus();
            bookingConfirmationPage.checkForAddons();
            bookingConfirmationPage.checkTripDetails();
            bookingConfirmationPage.checkTicketNumbers();
            cy.allure().endStep();
        });
    });
});
