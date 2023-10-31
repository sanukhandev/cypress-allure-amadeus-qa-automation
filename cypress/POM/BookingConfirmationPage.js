import BasePage from "./BasePage";

class BookingConfirmationPage extends BasePage {
    confimedCommercialRuleIDs = [];

    bookingSummary() { return cy.get('div').contains('Booking Summary'); }
    bookingStatus() { return cy.get('h3.empireFlight_confirmBookingStatus'); }
    confirmPayText() { return cy.get('div.empireFlight_confirmPaytxt > span > span'); }
    pnrText() { return cy.get('h4.empireFlight_confirmPnr'); }
    ticketNoColumn() {
        return cy.get('.empireFlight_Commonhead:contains("Traveller Details")')
            .parents('.empireFlight_CommonCard')
            .find('td:contains("Ticket No.") + td');
    }

    interceptBookingConfirmation() {
        cy.intercept('POST', '**/api/FlightConfirmation/GetBookingTicketingRes').as('bookingConfirmation');

        cy.wait('@bookingConfirmation', {timeout: 30000}).then((interception) => {
            const {body} = interception.response;
            this.getConfirmCommercialRuleIDs(body);
        });
    }

    getConfirmCommercialRuleIDs(body) {
        let ids = [];
        body.result.orderList.forEach(order => {
            order.pnrDetailRs.forEach(pnrDetail => {
                pnrDetail.flightFareBreakup.forEach(flightFareBreakupItem => {
                    flightFareBreakupItem.fareBreakup.forEach(fareBreakupItem => {
                        ids.push(fareBreakupItem.appliedCommercialRuleID);
                    });
                });
            });
        });
        this.confimedCommercialRuleIDs = [...new Set(ids)];
    }

    checkBookingStatus() {
        this.bookingSummary().should('be.visible');
        this.bookingStatus().should('be.visible').invoke('text').then((text) => {
            cy.allure().log(`Booking status is ${text}`);
        });
    }

    checkTripDetails() {
        this.confirmPayText().invoke('text').then((tripId) => {
            cy.allure().log(`Trip ID is ${tripId}`);
        });
        this.pnrText().invoke('text').then((pnr) => {
            cy.allure().log(`PNR is ${pnr}`);
        });
    }

    checkTicketNumbers() {
        this.ticketNoColumn().invoke('text').then(ticketNumber => {
            cy.allure().log(`Ticket number is ${ticketNumber}`);
        });
    }

    checkForAddons() {
        cy.allure().startStep(`Check for addons`);
        cy.get('body').find('div.empireF_Anci').then(($div) => {
            if ($div.length) {
                cy.allure().log(`Addons are available`);
            } else {
                cy.allure().log(`Addons are not available`);
            }
            cy.allure().endStep();
        });
    }
}

export default BookingConfirmationPage;
