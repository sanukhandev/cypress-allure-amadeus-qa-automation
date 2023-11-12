import BasePage from "./BasePage";
import customerData from "../fixtures/sampleCustomer.json";

class BookingComponent extends BasePage {
    // Constants for static data like selectors
    static BOOK_NOW_BTN_SELECTOR = '.flightDetailText';
    static ANCILLARY_TAB_SELECTOR = 'div.empireF_Anci div.empireF_AnciSeatTabContent';
    static ANCILLARY_ADD_BTN_SELECTOR = 'div.empireF_AnciSeatTabContent button';
    static TRAVELER_FORM_BODY_SELECTOR = 'div.empireF_TravelerFormBody';
    static EMAIL_INPUT_SELECTOR = 'input[formcontrolname="EmailAddress"]';
    static MOBILE_INPUT_SELECTOR = 'input[formcontrolname="MobileNo"]';
    static FIRST_NAME_INPUT_SELECTOR = 'input[formcontrolname="FirstName"]';
    static LAST_NAME_INPUT_SELECTOR = 'input[formcontrolname="LastName"]';
    static DOCUMENT_NUMBER_INPUT_SELECTOR = 'input[formcontrolname="DocumentNumber"]';
    static PROCEED_TO_PAYMENT_BTN_SELECTOR = 'button div:contains("Proceed to payment")';

    bookFlight = () => {
        cy.get(BookingComponent.BOOK_NOW_BTN_SELECTOR).click({force: true});
        this.fillCustomerDetails();
        this.checkAndHandleAncillaryServices();
    }

    proceedToPayment = () => {
        cy.get(BookingComponent.PROCEED_TO_PAYMENT_BTN_SELECTOR).click();
        cy.wait('@networkCall'); // Assuming an alias for network call
    }

    verifyAncillaryServices(context = '') {
        cy.allure().logStep(`Ancillary services are available on ${context}`);
        cy.allure().startStep(`Checking ancillary services addition to fare total on ${context}`);
        cy.get('div.empireF_TravelerDetailsText.empireF_TravelerDetailVatTxt').then(($div) => {
            const hasBaggages = $div.find('h4').map((_, el) => Cypress.$(el).text()).get().includes('Baggages');
            hasBaggages
                ? cy.allure().endStep()
                : cy.allure().logStep(`Ancillary services not added to fare total on ${context}`);
        });
    }

    checkAndHandleAncillaryServices = () => {
        cy.get('body').then($body => {
            if ($body.find(`div.empireF_Anci`).length) {
                cy.get(BookingComponent.ANCILLARY_TAB_SELECTOR).each(() => {
                    cy.get(BookingComponent.ANCILLARY_ADD_BTN_SELECTOR).click();
                    this.isAncillaryServicesAvailable = true;
                });
                this.verifyAncillaryServices('Ancillary Services Section');
            } else {
                cy.log(`Ancillary block not found for the airline.`);
            }
        });
    }

    fillCustomerDetails = () => {
        cy.get(BookingComponent.TRAVELER_FORM_BODY_SELECTOR).each(($body, index) => {

            // check in body that field is visbile by selector


            cy.wrap($body).within(() => {
                cy.get('h4.empireF_TravelerFormTitle').invoke('text').then((text) => {
                    const passengerType = this.determinePassengerType(text);
                    const passengerData = customerData[passengerType][index];
                    this.fillDetailsForPassenger(passengerData);
                });
            });
        });

        cy.get(BookingComponent.EMAIL_INPUT_SELECTOR).type('sanu@test.comm');
        this.fillNgSelect('phne_code', 'United Arab Emirates');
        cy.get(BookingComponent.MOBILE_INPUT_SELECTOR).type('1234567890');
    }

    determinePassengerType(text) {
        const formattedText = text.trim().toLowerCase().replace('(adult with infant on lap)', '').replace('passport information', '');
        return formattedText.includes('adult') ? 'Adults' :
            formattedText.includes('child') ? 'Children' : 'Infants';
    }


    fillDetailsForPassenger(passenger) {
        // Assuming the passenger object contains fields like title, first name, last name, etc.
        const { title, first, last, documentNumber, issuingCountry, nationality, DoB, expiry } = passenger;

        // Convert the date strings into date parts
        const [DOBYear, DOBMonth, DOBDay] = DoB.split('-');
        const [expiryYear, expiryMonth, expiryDay] = expiry.split('-');

        // Fill in each form field. The selectors for these need to be defined based on your app's structure
        // Example: Assuming you have a method to select dropdowns (like for title, issuing country, etc.)

        this.fillNgSelect('Title', title);
        this.fillTextField(BookingComponent.FIRST_NAME_INPUT_SELECTOR, first);
        this.fillTextField(BookingComponent.LAST_NAME_INPUT_SELECTOR, last);
        this.fillTextField(BookingComponent.DOCUMENT_NUMBER_INPUT_SELECTOR, documentNumber);
        this.fillNgSelect('DocumentIssuingCountry', issuingCountry);
        this.fillNgSelect('Nationality', nationality);

        // Assuming you have a method to fill in date fields
        this.setDate('empireF_travelerDateofBirth','BirthDate','BirthMonth','BirthYear', DOBDay, DOBMonth, DOBYear);
        this.setDate('VisaIssueWrapper','DocumentExpiryDay','DocumentExpiryMonth',"DocumentExpiryYear", expiryDay, expiryMonth, expiryYear);
    }



}

export default BookingComponent;
