import RTflightSearchPage from "../POM/RTflightSearchPage";
import BookingComponent from "../POM/BookingComponent";


const paxSearchData = [
    { adult: "1", child: "0", infant: "0" }, // One Adult
    { adult: "2", child: "0", infant: "0" }, // Two Adults
    { adult: "3", child: "0", infant: "0" }, // Three Adults
    { adult: "1", child: "1", infant: "0" }, // One Adult, One Child
    { adult: "1", child: "0", infant: "1" }, // One Adult, One Infant
    { adult: "1", child: "1", infant: "1" }  // One Adult, One Child, One Infant
];
const airlinesData = ["EK", "EY", "QR", "BA"];
describe('Flight Search RT', () => {

    const rtFlightSearch = new RTflightSearchPage()
    const bookingComponent = new BookingComponent()

    paxSearchData.forEach((data) => {
        it(`should make Search rt WITH ${data.adult} adult, ${data.child} child, ${data.infant} infant`, () => {
            cy.allure().startStep(`Make search with ${data.adult} adult, ${data.child} child, ${data.infant} infant`)
            rtFlightSearch.makeSearchWithPax(data.adult, data.child, data.infant);
            cy.allure().startStep(" should be able to click and validate advance search options")
            rtFlightSearch.isResponseVisible();
            cy.allure().endStep();
            cy.allure().endStep();
        });
    });

    airlinesData.forEach((airlineCode) => {
        it(`Should search with specific airline ${airlineCode}`, () => {
            cy.allure().startStep(`Search with specific airline ${airlineCode}`)
            rtFlightSearch.makeSearchWithAirlines(airlineCode);
            cy.allure().startStep(" should be able to click and validate advance search options")
            rtFlightSearch.isResponseVisible();
            cy.allure().endStep();
            cy.allure().endStep();
        });
    });


    it('should search with baggage only', () => {
        cy.allure().startStep("Search with baggage only")
        rtFlightSearch.makeSearchWithBaggage();
        cy.allure().startStep(" should be able to click and validate advance search options")
        rtFlightSearch.isResponseVisible();
    });

    it('should search with direct only', () => {
        cy.allure().startStep("Search with direct only")
        rtFlightSearch.makeSearchWithDirect();
        cy.allure().startStep(" should be able to click and validate advance search options")
        rtFlightSearch.isResponseVisible();
    })

    it('should search with refundable', () => {
        cy.allure().startStep("Search with refundable")
        rtFlightSearch.makeSearchWithRefundable();
        cy.allure().startStep(" should be able to click and validate advance search options")
        rtFlightSearch.isResponseVisible();

    });

    it('should search with refundable and direct', () => {
        cy.allure().startStep("Search with refundable and direct")
        rtFlightSearch.makeSearchWithRefundableAndDirect();
        cy.allure().startStep(" should be able to click and validate advance search options")
        rtFlightSearch.isResponseVisible();
    })

    it('should search with  calender', () => {
        cy.allure().startStep("Search with IPC calender")
        rtFlightSearch.makeSearchWithIPC();
        cy.allure().startStep(" should be able to click and validate advance search options")
        rtFlightSearch.isResponseVisible();
    });

    it('should validate components RT 1 PAX', () => {
        cy.allure().startStep("Make search with one Pax")
        rtFlightSearch.makeSearchWithPax("1","0","0")
       cy.allure().endStep()
    });


    it('should validate components RT 1 PAX and lick branded fares', () => {
        cy.allure().startStep("Make search with one Pax")
        rtFlightSearch.makeSearchWithPax("1","0","0")
        cy.allure().endStep()
        cy.allure().startStep("Click branded fares")
        rtFlightSearch.getFlightDetails()
        cy.allure().endStep()
    });

    it('Shoudl validate traveller page for 1 pax', () => {

        cy.allure().startStep("Make search with one Pax")
        rtFlightSearch.makeSearchWithPax("1","0","0")
        cy.allure().endStep()
        cy.allure().startStep("Click branded fares")
        rtFlightSearch.getFlightDetails()
        cy.allure().endStep()
        cy.allure().startStep("Go to Travller information page")
        bookingComponent.bookFlight();
        cy.allure().endStep()

    });

    it('Should validate traveler page for 2 adults', () => {
        cy.allure().startStep("Make search with two adults")
        rtFlightSearch.makeSearchWithPax("2","0","0")
        cy.allure().endStep()
        cy.allure().startStep("Select desired flights")
        rtFlightSearch.getFlightDetails()
        cy.allure().endStep()
        cy.allure().startStep("Proceed to Traveler Information Page")
        bookingComponent.bookFlight();
        cy.allure().endStep()
    });

    it('Should validate traveler page for 3 adults', () => {
        cy.allure().startStep("Make search with three adults")
        rtFlightSearch.makeSearchWithPax("3","0","0")
        cy.allure().endStep()
        cy.allure().startStep("Select desired flights")
        rtFlightSearch.getFlightDetails()
        cy.allure().endStep()
        cy.allure().startStep("Proceed to Traveler Information Page")
        bookingComponent.bookFlight();
        cy.allure().endStep()
    });

    it('Should validate traveler page for 1 adult and 1 child', () => {
        cy.allure().startStep("Make search with one adult and one child")
        rtFlightSearch.makeSearchWithPax("1","1","0")
        cy.allure().endStep()
        cy.allure().startStep("Select desired flights")
        rtFlightSearch.getFlightDetails()
        cy.allure().endStep()
        cy.allure().startStep("Proceed to Traveler Information Page")
        bookingComponent.bookFlight();
        cy.allure().endStep()
    });

    it('Should validate traveler page for 1 adult and 1 infant', () => {
        cy.allure().startStep("Make search with one adult and one infant")
        rtFlightSearch.makeSearchWithPax("1","0","1")
        cy.allure().endStep()
        cy.allure().startStep("Select desired flights")
        rtFlightSearch.getFlightDetails()
        cy.allure().endStep()
        cy.allure().startStep("Proceed to Traveler Information Page")
        bookingComponent.bookFlight();
        cy.allure().endStep()
    });

    it('Should validate traveler page for 1 adult, 1 child and 1 infant', () => {
        cy.allure().startStep("Make search with one adult, one child and one infant")
        rtFlightSearch.makeSearchWithPax("1","1","1")
        cy.allure().endStep()
        cy.allure().startStep("Select desired flights")
        rtFlightSearch.getFlightDetails()
        cy.allure().endStep()
        cy.allure().startStep("Proceed to Traveler Information Page")
        bookingComponent.bookFlight();
        cy.allure().endStep()
    });


})
