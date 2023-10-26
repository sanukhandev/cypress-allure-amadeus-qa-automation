import BasePage from "./BasePage";

class PaymentConfirmationPage extends BasePage {
    // Use methods to get elements
    payfortGateway() { return cy.get('span').contains('PayFort Gateway'); }
    proceedToPayBtn() { return cy.get('div').contains('Proceed to Pay'); }

    cardNoInput() { return cy.get('input#cardNoInput'); }
    chNameInput() { return cy.get('input#chNameInput'); }
    expDateInput() { return cy.get('input#expDateInput'); }
    cvvInput() { return cy.get('input#cvvInput'); }
    payBtn() { return cy.get('button').contains('Pay'); }

    proceedToPayment(cardDetails) {
        this.payfortGateway().click();
        this.proceedToPayBtn().click();

        // Wait for a specific element or network response
        cy.origin('https://sbcheckout.payfort.com/', () => {
            // Make sure elements are available before typing
            this.cardNoInput().should('be.visible').type(cardDetails.number);
            this.chNameInput().should('be.visible').type(cardDetails.holderName);
            this.expDateInput().should('be.visible').type(cardDetails.expiry);
            this.cvvInput().should('be.visible').type(cardDetails.cvv);
            this.payBtn().click();
        });
    }
}

export default PaymentConfirmationPage;
