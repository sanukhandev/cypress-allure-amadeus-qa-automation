const {jsonToQueryString} = require("../integration/utils");

class FlightSearchBase {

    lowFareFinderResponse = [];
    allFlightDataRenderd = [];

    getFlights = query => {
        this.interceptLowFareFinder();
        cy.visit(`Flight/search?${jsonToQueryString(query)}`);
        cy.wait('@lowFareFinder', { timeout: 120000 }).then((interception) => {
            this.lowFareFinderResponse =   this.formatResponse(interception.response.body);
            cy.wait(1000); // to render
            if(query.ipc){
                cy.get('empire-rt-pricing-calender').should('be.visible');
            }
           this.validateFlightListing()

        });
    };
    get flightListingContainer() { return cy.get('.empireFlight_ListingBodycontainer'); }
    get sortByComponent() { return cy.get('div.empireFlight_SortBy', { timeout: 10000 }); }
    get filterComponent() { return cy.get('div.empireFlight_filter-lastitem', { timeout: 10000 }); }
    get filterBody() { return cy.get('.empireFlight_filter-body'); }
    get applyBtn() { return cy.get('div.empireFlight_filter-action-head').find('button').contains('Apply'); }

    get flightListing () { return cy.get('.empireFlight_main-box-listing') }
    isResponseVisible() {
        this.flightListingContainer.should('be.visible');
    }


    interceptLowFareFinder() {
        cy.intercept('POST', '**/api/v2/offer/lowfare').as('lowFareFinder')
    }
    interceptBrandedFares() {
        cy.intercept('POST', '**/api/v2/offer/brandedfare').as('brandedFares');
    }

    validateFlightListing() {
        this.flightListingContainer.should('be.visible');
        this.sortByComponent.should('be.visible');
        this.filterComponent.should('be.visible');

        console.log(this.lowFareFinderResponse)

        // this.lowFareFinderResponse.forEach((fopItem, index) => {
        //     //validate flight name
        //     cy.get('.empireFlight_FlightNames h4').eq(index).should('have.text', fopItem.type);
        // })

        this.flightListing.should("be.visible")
        // this.flightListing.should('have.length', this.lowFareFinderResponse[0].flightOptions.length);
        // match count

    }


     formatResponse(body) {
        const { fop, airlines, airports, cities, countries } = body;
        return fop.map(fopItem => ({
            type: fopItem.type,
            flightOptions: fopItem.fop.map(foItem => ({
                flightInfoId: foItem.fii,
                segmentsGroups: foItem.fsg.map(segmentGroup => ({
                    segments: segmentGroup.flg.map(segment => ({
                        flightNumber: `${segment.occ} ${segment.fnm}`,
                        airline: airlines[segment.occ],
                        departureAirport: airports[segment.dac],
                        departureCity: cities[segment.dac],
                        departureCountry: countries[airports[segment.dac].split('~')[2]],
                        departureDate: segment.ddt,
                        departureTime: segment.dti,
                        arrivalAirport: airports[segment.aac],
                        arrivalCity: cities[segment.aac],
                        arrivalCountry: countries[airports[segment.aac].split('~')[2]],
                        arrivalDate: segment.adt,
                        arrivalTime: segment.ati,
                        flightDuration: `${segment.tfdh}h ${segment.tfdm}m`
                    })),
                    totalTravelDuration: `${segmentGroup.ttdh}h ${segmentGroup.ttdm}m`,
                    numberOfStops: segmentGroup.flg.length - 1 // Added number of stops
                })),
                pricing: {
                    total: foItem.fo.total,
                    currency: foItem.fo.currency
                },
                tripDuration: foItem.tripd
            }))
        }));
    }


    interceptBrandedFaresRequest() {
        cy.intercept('POST', '**/api/v2/offer/brandedfare').as('brandedFares');
    }

    getFlightDetails() {
        this.interceptBrandedFaresRequest()
        this.flightListingContainer.contains('Select').click({ force: true });
        cy.wait('@brandedFares', { timeout: 30000 }).then((interception) => {
            const { body } = interception.response;
            this.getCommercialRuleIDs(body);
            cy.allure().logStep(`Applied commercial rule IDs are ${this.appliedCommercialRuleIDs.join(', ')}`);
        });
    }

    getCommercialRuleIDs(body) {
        let ids = [];
        body.flightSummary.forEach(summary => {
            summary.flightOptions.fo.forEach(foItem => {
                foItem.fr.forEach(frItem => {
                    frItem.pfi.forEach(pfiItem => {
                        ids.push(pfiItem.fpb.appliedCommercialRuleID);
                    });
                });
            });
        });
        this.appliedCommercialRuleIDs = [...new Set(ids)];
    }





}

module.exports = FlightSearchBase;
