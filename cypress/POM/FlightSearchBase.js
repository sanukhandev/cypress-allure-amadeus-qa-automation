const {jsonToQueryString} = require("../integration/utils");

class FlightSearchBase {

    lowFareFinderResponse = [];
    allFlightDataRenderd = [];

    getFlights = query => {
        this.interceptLowFareFinder();
        cy.visit(`Flight/search?${jsonToQueryString(query)}`);
        cy.wait('@lowFareFinder', { timeout: 30000 }).then((interception) => {
            this.lowFareFinderResponse =   this.formatResponse(interception.response.body);
            cy.wait(1000); // to render
            this.getDisplayedFlightOptions().then((data) => {
                this.allFlightDataRenderd = data;
                this.validateFlightListing();
            });

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
        // match count
        this.flightListing.should('have.length', this.lowFareFinderResponse.length);
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
        return this.flightListing.should('be.visible').each($box => {
            const data = { airline: '', price: null, currency: '', departure: {}, return: {} };

            // Airline, price, and currency extraction
            cy.wrap($box).scrollIntoView().then(() => {
                cy.wrap($box).find('.empireFlight-roundTripHead .empireFlight-roundTripLogos span', { timeout: 10000 }).then($airlineSpan => {
                    if ($airlineSpan.length) {
                        data.airline = $airlineSpan.text().trim();
                    }
                });

                cy.wrap($box).find('.empireFlight_amount').then($price => {
                    if ($price.length) {
                        const priceText = $price.text().trim();
                        data.price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
                        data.currency = priceText.split(' ')[0];
                    }
                });
            });

            // Departure and return city and date extraction
            cy.wrap($box).scrollIntoView().find('.empireFlight_listing-subhead').each(($subhead, index) => {
                const type = index === 0 ? 'departure' : 'return';
                const cityDateText = $subhead.find('.empireFlight_CityName').text().trim();
                const dateText = $subhead.find('.empireFlight_airline-date').text().trim();

                if (cityDateText && dateText) {
                    const [origin, destination] = cityDateText.split(' - ');
                    data[type] = {
                        origin: origin,
                        destination: destination,
                        date: dateText
                    };
                }
            });
            cy.wrap($box).scrollIntoView().find('.empireFlight-cardboxroundTrip').each(( cardboxroundTrip, index) => {
                const tripType = index === 0 ? 'departure' : 'return';

                Cypress.$(cardboxroundTrip).find('.empireFlight_cardbox').each((_, cardbox) => {
                    cy.wrap(cardbox).scrollIntoView().then(() => {
                        const body = Cypress.$(cardbox).find('.empireFlight_listing-body');
                        const tripData = {
                            flightName: body.find('.empireFlight_FlightNames h4').text().trim(),
                            airlineCodes: body.find('.empire_airlinecode h6').map((i, el) => Cypress.$(el).text().trim()).get(),
                            departureTime: body.find('.empireFlight_FlightTime').first().text().trim(),
                            departureAirportCode: body.find('.empireFlight_FlightCode').first().text().trim(),
                            duration: body.find('.empireFlight_time p').text().trim(),
                            numberOfStops: body.find('.empireFlight_stopvia span').first().text().trim(),
                            arrivalTime: body.find('.empireFlight_FlightTime').last().text().trim(),
                            arrivalAirportCode: body.find('.empireFlight_FlightCode').last().text().trim()
                        };
                        data[tripType] = {...data[tripType], tripData};
                    });
                });
            });


            allFlightData.push(data);
        }).then(() => {
            return allFlightData;
        });
    }





}

module.exports = FlightSearchBase;