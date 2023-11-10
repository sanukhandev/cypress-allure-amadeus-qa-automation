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


    getDisplayedFlightOptions() {
        const allFlightData = [];

        // Helper function to extract flight details
        const extractFlightDetails = ($cardbox, type) => {
            const body = $cardbox.find('.empireFlight_listing-body');
            return {
                flightName: body.find('.empireFlight_FlightNames h4').text().trim(),
                airlineCodes: body.find('.empire_airlinecode h6').map((i, el) => Cypress.$(el).text().trim()).get(),
                departureTime: body.find('.empireFlight_FlightTime').first().text().trim(),
                departureAirportCode: body.find('.empireFlight_FlightCode').first().text().trim(),
                duration: body.find('.empireFlight_time p').text().trim(),
                numberOfStops: body.find('.empireFlight_stopvia span').first().text().trim(),
                arrivalTime: body.find('.empireFlight_FlightTime').last().text().trim(),
                arrivalAirportCode: body.find('.empireFlight_FlightCode').last().text().trim()
            };
        };

        // Helper function to process a single box
        const processData = ($box) => {
            const data = { airline: '', price: null, currency: '', departure: {}, return: {} };

            return cy.wrap($box).scrollIntoView({ timeout: 10000 }).then(() => {
                // Extracting city, date, and flight details
                $box.find('.empireFlight_listing-subhead').each((index, subheadElement) => {
                    const $subhead = Cypress.$(subheadElement);
                    const type = index === 0 ? 'departure' : 'return';
                    const cityDateText = $subhead.find('.empireFlight_CityName').text().trim();
                    const dateText = $subhead.find('.empireFlight_airline-date').text().trim();

                    if (cityDateText && dateText) {
                        const [origin, destination] = cityDateText.split(' - ');
                        data[type] = { origin, destination, date: dateText };
                    }
                });

                // Extracting airline, price, and currency
                $box.find('.empireFlight-roundTripHead .empireFlight-roundTripLogos span').each((_, span) => {
                    data.airline = `${data.airline} ${Cypress.$(span).text().trim()}`;
                });

                $box.find('.empireFlight-cardboxroundTrip').each((_, cardboxroundTrip) => {
                    const tripType = _ === 0 ? 'departure' : 'return';

                    Cypress.$(cardboxroundTrip).find('.empireFlight_cardbox').each((_, cardbox) => {
                        data[tripType] = extractFlightDetails(Cypress.$(cardbox), tripType);
                    });
                });

                return cy.wrap(data);
            });
        };

        // Process each flight listing box
        return this.flightListing.should('be.visible').each($box => {
            processData($box).then(data => {
                allFlightData.push(data);
            });
        }).then(() => {
            console.log('allFlightData', allFlightData)
            return allFlightData;
        });
    }


}

module.exports = FlightSearchBase;
