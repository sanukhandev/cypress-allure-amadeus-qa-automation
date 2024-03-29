import OWflightSearchPage from "../POM/OWflightSearchPage";
import BookingComponent from "../POM/BookingComponent";


const paxSearchData = [
    { adult: "1", child: "0", infant: "0" }, // One Adult
    { adult: "2", child: "0", infant: "0" }, // Two Adults
    { adult: "3", child: "0", infant: "0" }, // Three Adults
    { adult: "1", child: "1", infant: "0" }, // One Adult, One Child
    { adult: "1", child: "0", infant: "1" }, // One Adult, One Infant
    { adult: "1", child: "1", infant: "1" }  // One Adult, One Child, One Infant
];
const airlinesData = ["EK", "EY", "QR", "BA","RJ"];
describe('Flight Search RT', () => {

    const owFlightSearch = new OWflightSearchPage()
    const bookingComponent = new BookingComponent()

    paxSearchData.forEach((data) => {
        it(`should make Search rt WITH ${data.adult} adult, ${data.child} child, ${data.infant} infant`, () => {
            cy.allure().startStep(`Make search with ${data.adult} adult, ${data.child} child, ${data.infant} infant`)
            owFlightSearch.makeSearchWithPax(data.adult, data.child, data.infant);
            cy.allure().startStep(" should be able to click and validate advance search options")
            owFlightSearch.isResponseVisible();
            cy.allure().endStep();
            cy.allure().endStep();
        });
    });

    airlinesData.forEach((airlineCode) => {
        it(`Should search with specific airline ${airlineCode}`, () => {
            cy.allure().startStep(`Search with specific airline ${airlineCode}`)
            owFlightSearch.makeSearchWithAirlines(airlineCode);
            cy.allure().startStep(" should be able to click and validate advance search options")
            owFlightSearch.isResponseVisible();
            cy.allure().endStep();
            cy.allure().endStep();
        });
    });


    it('should search with baggage only', () => {
        cy.allure().startStep("Search with baggage only")
        owFlightSearch.makeSearchWithBaggage();
        cy.allure().startStep(" should be able to click and validate advance search options")
        owFlightSearch.isResponseVisible();
    });

    it('should search with direct only', () => {
        cy.allure().startStep("Search with direct only")
        owFlightSearch.makeSearchWithDirect();
        cy.allure().startStep(" should be able to click and validate advance search options")
        owFlightSearch.isResponseVisible();
    })

    it('should search with refundable', () => {
        cy.allure().startStep("Search with refundable")
        owFlightSearch.makeSearchWithRefundable();
        cy.allure().startStep(" should be able to click and validate advance search options")
        owFlightSearch.isResponseVisible();

    });

    it('should search with refundable and direct', () => {
        cy.allure().startStep("Search with refundable and direct")
        owFlightSearch.makeSearchWithRefundableAndDirect();
        cy.allure().startStep(" should be able to click and validate advance search options")
        owFlightSearch.isResponseVisible();
    })

    it('should search with  calender', () => {
        cy.allure().startStep("Search with IPC calender")
        owFlightSearch.makeSearchWithIPC();
        cy.allure().startStep(" should be able to click and validate advance search options")
        owFlightSearch.isResponseVisible();
    });

    it('should validate components RT 1 PAX', () => {
        cy.allure().startStep("Make search with one Pax")


        owFlightSearch.makeSearchWithPax("1","0","0")
       cy.allure().endStep()
    });


    it('should validate components RT 1 PAX and lick branded fares', () => {
        cy.allure().startStep("Make search with one Pax")
        owFlightSearch.makeSearchWithPax("1","0","0")
        cy.allure().endStep()
        cy.allure().startStep("Click branded fares")
        owFlightSearch.getFlightDetails()
        cy.allure().endStep()
    });

    it('should be able to book 1 pax', () => {

        cy.allure().startStep("Make search with one Pax")
        owFlightSearch.makeSearchWithPax("1","0","0")
        cy.allure().endStep()
        cy.allure().startStep("Click branded fares")
        owFlightSearch.getFlightDetails()
        cy.allure().endStep()
        cy.allure().startStep("Go to Travller information page")
        bookingComponent.bookFlight();
        cy.allure().endStep()

    });

    it('Should validate traveler page for 3 adults', () => {
        cy.allure().startStep("Make search with three adults")
        owFlightSearch.makeSearchWithPax("3","0","0")
        cy.allure().endStep()
        cy.allure().startStep("Select desired flights")
        owFlightSearch.getFlightDetails()
        cy.allure().endStep()
        cy.allure().startStep("Proceed to Traveler Information Page")
        bookingComponent.bookFlight();
        cy.allure().endStep()
    });

    it('Should validate traveler page for 1 adult and 1 child', () => {
        cy.allure().startStep("Make search with one adult and one child")
        owFlightSearch.makeSearchWithPax("1","1","0")
        cy.allure().endStep()
        cy.allure().startStep("Select desired flights")
        owFlightSearch.getFlightDetails()
        cy.allure().endStep()
        cy.allure().startStep("Proceed to Traveler Information Page")
        bookingComponent.bookFlight();
        cy.allure().endStep()
    });

    it('Should validate traveler page for 1 adult and 1 infant', () => {
        cy.allure().startStep("Make search with one adult and one infant")
        owFlightSearch.makeSearchWithPax("1","0","1")
        cy.allure().endStep()
        cy.allure().startStep("Select desired flights")
        owFlightSearch.getFlightDetails()
        cy.allure().endStep()
        cy.allure().startStep("Proceed to Traveler Information Page")
        bookingComponent.bookFlight();
        cy.allure().endStep()
    });

    it('Should validate traveler page for 1 adult, 1 child and 1 infant', () => {
        cy.allure().startStep("Make search with one adult, one child and one infant")
        owFlightSearch.makeSearchWithPax("1","1","1")
        cy.allure().endStep()
        cy.allure().startStep("Select desired flights")
        owFlightSearch.getFlightDetails()
        cy.allure().endStep()
        cy.allure().startStep("Proceed to Traveler Information Page")
        bookingComponent.bookFlight();
        cy.allure().endStep()
    });



})
