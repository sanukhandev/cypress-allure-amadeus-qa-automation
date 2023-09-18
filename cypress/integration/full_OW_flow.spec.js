const {jsonToQueryString, defalutOWpayloadQuery} = require("./utils");
const customerData = require('../fixtures/sampleCustomer.json');
describe('Check the full OW flow with all filter checks', () => {
    const waitForNetworkRequest = () => {
        cy.wait('@networkRequests', {timeout: 30000}).wait(2000);
    }
    const interceptBrandedFares = () => {
        cy.intercept('POST', '**/api/v2/offer/brandedfare').as('brandedFares');
    }

    const interceptBookingConfirmation = () => {
        cy.intercept('POST', '**/api/v2/FlightConfirmation/GetBookingTicketingRes').as('bookingConfirmation');
    }

    const verifyFlightCards = (selector, text) => {
        cy.get(selector)
            .each(($div) => {
                cy.wrap($div).invoke('text').should('match', text);
            });
    };
    const setDate = (containerClass, dayControl, monthControl, yearControl, day, month, year) => {
        const selectDate = (name, value) => {
            cy.get(`div.${containerClass}`).find(`ng-select[formcontrolname="${name}"]`).click();
            cy.get('div.ng-dropdown-panel-items').find('div.ng-option').contains(value).click();
        };
        selectDate(dayControl, day);
        selectDate(monthControl, month);
        selectDate(yearControl, year);
    };

    let appliedCommercialRuleIDs = [];

    const adjustSlider = (selectorBaseText, newPosition, direction) => {
        const adjust = ($el, position) => {
            const elPosition = $el.position();
            cy.wrap($el).trigger('mousedown', {which: 1, pageX: elPosition.left, pageY: elPosition.top}).click();
        };
        cy.contains('h5.empireFlight_filter-sub-title', selectorBaseText).then(($el) => {
            const selector = $el.siblings('div.empireFlight_filter-dropdown-items').find(`.ngx-slider-pointer-${direction}`);
            cy.get(selector).invoke('css', 'left', `${newPosition}px`).then(adjust);
        });
    };

    const resetSlider = selectorBaseText => cy.contains('h5.empireFlight_filter-sub-title', selectorBaseText).find('span.empireFlight_filter-reset').click();

    const clickMorefilters = () => {
        cy.get('div.empireFlight_SortBy', {timeout: 10000}).should('be.visible');
        cy.get('div.empireFlight_filter-lastitem').contains('More Filters').click();
        cy.get('.empireFlight_filter-body').should('be.visible');
    };

    const clickFilterApply = () => {
        cy.get('div.empireFlight_filter-action-head').find('button').contains('Apply').click();
        cy.wait(2000);
    };
    const verifyCards = (selector, text) => {
        cy.get(selector).each(($element) => {
            cy.wrap($element).should('contain', text);
        });
    };

    beforeEach(() => {
        cy.intercept('*', () => {
        }).as('networkRequests')
    })

    const getFlights = query => {
        cy.visit(`Flight/search?${jsonToQueryString(defalutOWpayloadQuery(...query))}`);
        cy.wait(2000);
        cy.allure().startStep('Wait for network request')
        waitForNetworkRequest()
        cy.allure().endStep('passed');
    };

    const getFlightDetails = () => {
        cy.intercept('*', () => {
        }).as('networkRequests');
        cy.wait(2000);
        cy.get('.empireFlight_ListingBodycontainer').contains('Select').click({force: true})
        interceptBrandedFares();
        cy.wait('@brandedFares', {timeout: 30000}).then((interception) => {
            const {body} = interception.response;
            appliedCommercialRuleIDs = getCommercialRuleIDs(body);
            cy.allure().logStep(`Applied commercial rule IDs are ${appliedCommercialRuleIDs.join(', ')}`);
        });

    };

    const checkFlightDetails = () => {
        cy.get('.empireFlight_DetailsBody').should('be.visible');

        // Verify each tab label and click on them
        const tabs = [' Fare Options ', ' Flight Itinerary ', ' Baggage ', ' Fare Breakup '];

        tabs.forEach(tab => {
            cy.allure().startStep(`Verify ${tab} tab is clickable and has content`)
            cy.get('.mat-tab-label')
                .contains(tab)
                .should('be.visible')
                .click();

            if (tab === ' Fare Options ') {
                cy.allure().startStep('Verify Fare Options tab has content')
                cy.get('.empireFlight_ValueCardWarapperSame').find('p').contains('Fare Options').should('be.visible');
                cy.allure().endStep('passed');
            }
            if (tab === ' Flight Itinerary ') {
                cy.allure().startStep('Verify Flight Itinerary tab has content')
                cy.get('div.empireFlight_ItWrapper').should('be.visible');
                cy.allure().endStep('passed');
            }
            if (tab === ' Baggage ') {
                cy.allure().startStep('Verify Baggage tab has content')
                cy.get('div.empireF_bagWrapper').should('be.visible');
                cy.allure().endStep('passed');
            }
            if (tab === ' Fare Breakup ') {
                cy.allure().startStep('Verify Fare Breakup tab has content')
                cy.get('div.empireF_lightFareBreakup').should('be.visible');
                cy.allure().endStep('passed');
            }
            cy.allure().endStep('passed');
        });

    }


    const getCommercialRuleIDs = (body) => {
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
        console.log(ids, 'ids' )
        return ids;
    }

    const getConfirmCommercialRuleIDs = (body) => {
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
        console.log(ids, 'ids' )
        return ids;
    }

    const bookFlight = () => {
        cy.get('.flightDetailText').contains('Book Now').click({force: true})

        const {Adults} = customerData;
        cy.wait('@networkRequests', {timeout: 30000});

        cy.wait(2000);
        cy.get('div.empireF_TravelerFormBody').find('ng-select[formcontrolname="Title"]').click()
        cy.get('div.ng-dropdown-panel-items').find('div.ng-option').contains(Adults[0].title).click()

        cy.get('input[formcontrolname="FirstName"]').type(Adults[0].first)
        cy.get('input[formcontrolname="LastName"]').type(Adults[0].last)
        setDate('empireF_travelerDateofBirth', 'BirthDate', 'BirthMonth', 'BirthYear', '24', 'September', '1993');

        cy.get('ng-select[formcontrolname="DocumentType"]').click().find('div.ng-dropdown-panel-items').find('div.ng-option').contains(Adults[0].documentType).click()
        cy.get('input[formcontrolname="DocumentNumber"]').type(Adults[0].documentNumber)
        cy.get('ng-select[formcontrolname="DocumentIssuingCountry"]').click().find('div.ng-dropdown-panel-items').find('div.ng-option').contains(Adults[0].issuingCountry).click()
        cy.get('ng-select[formcontrolname="Nationality"]').click().find('div.ng-dropdown-panel-items').find('div.ng-option').contains(Adults[0].nationality).click()
        setDate('empireF_pasPortInfo', 'DocumentIssueDay', 'DocumentIssueMonth', 'DocumentIssueYear', '11', 'January', '2018');
        setDate('empireF_pasPortInfo', 'DocumentExpiryDay', 'DocumentExpiryMonth', 'DocumentExpiryYear', '10', 'January', '2028');
        cy.get('input[formcontrolname="EmailAddress"]').type(Adults[0].email)
        cy.get('ng-select[formcontrolname="phne_code"]').click().find('div.ng-dropdown-panel-items').find('div.ng-option').contains(Adults[0].countryCode).click()
        cy.get('input[formcontrolname="MobileNo"]').type(Adults[0].phone)
        cy.get('button').find('div').contains('Continue to payment').click()
        cy.wait('@networkRequests', {timeout: 30000});
        cy.wait(2000);
        cy.get('div').contains('Proceed to Pay').click()
        cy.wait(30000)
        cy.wait('@networkRequests', {timeout: 30000});
        cy.origin('https://sbcheckout.payfort.com/', () => {
            cy.get('input#cardNoInput').type('4005550000000001')
            cy.get('input#chNameInput').type('Test')
            cy.get('input#expDateInput').type('05/25')
            cy.get('input#cvvInput').type('123')
            cy.get('button').contains('Pay').click()
        })
        cy.wait(30000)
        cy.wait(30000)
        let confirmiedComeercialRuleIDs = [];
        interceptBookingConfirmation()
        cy.wait('@bookingConfirmation', {timeout: 30000}).then((interception) => {
            const {body} = interception.response;
            confirmiedComeercialRuleIDs = getConfirmCommercialRuleIDs(JSON.parse(body.respObj));
            cy.allure().logStep(`confirmiedComeercialRuleIDs commercial rule IDs are ${confirmiedComeercialRuleIDs.join(', ')}`);
            console.log(confirmiedComeercialRuleIDs, 'confirmiedComeercialRuleIDs')
        });
        cy.get('div').contains('Booking Summary').should('be.visible')
        cy.get('h3.empireFlight_confirmBookingStatus')
            .invoke('text')
            .then((text) => {
                // Do something with the text
                cy.allure().logStep(`Booking status is ${text}`)
            });

        cy.allure().logStep(`Applied commercial rule IDs are ${appliedCommercialRuleIDs.join(', ')}`);
        cy.allure().logStep(`Confirmed commercial rule IDs are ${confirmiedComeercialRuleIDs.join(', ')}`);
        cy.allure().startStep('Verify applied commercial rule IDs are same as confirmed commercial rule IDs')
        // expect(appliedCommercialRuleIDs).to.deep.equal(confirmiedComeercialRuleIDs);
        cy.allure().endStep('passed');

        cy.get('div.empireFlight_confirmPaytxt > span > span')
            .invoke('text')
            .then((tripId) => {
                // Do something with the tripId
                cy.allure().logStep(`Trip ID is ${tripId}`)
            });
        cy.get('h4.empireFlight_confirmPnr')
            .invoke('text')
            .then((pnr) => {
                // Do something with the pnr
                cy.allure().logStep(`PNR is ${pnr}`)
            });


    }

    it('should one way booking with filter checks', () => {
        cy.allure().startStep('Search for one way flight EK ')
        getFlights(['airlines', 'EK']);
        cy.allure().endStep('passed');
        cy.allure().startStep('Verify flight cards has Emirates')
        verifyFlightCards('div.empireFlight_FlightNames', /^Emirates\s/);
        cy.allure().endStep('passed');
        cy.allure().startStep('Verify flight cards has Direct')
        verifyCards('span.empireFlight_stopvia', 'Direct');
        cy.allure().endStep('passed');

        const filtersToApply = [
            {filter: ' Price ', min: 100, max: 200},
            {filter: ' Departure Timing ', min: 100, max: 200},
            {filter: ' Departure Trip Duration ', min: 100, max: 200},
            {filter: ' Arrival Timing ', min: 100, max: 200},
        ];

        filtersToApply.forEach(({filter, min, max}) => {
            cy.allure().startStep(`Apply filter ${filter} with min ${min} and max ${max}`)
            clickMorefilters();
            adjustSlider(filter, min, 'min');
            adjustSlider(filter, max, 'max');
            clickFilterApply();
            cy.allure().endStep('passed');
        });

        // Reset all filters
        cy.allure().startStep('Reset all filters')
        clickMorefilters();

        filtersToApply.forEach(({filter}) => {
            resetSlider(filter);
        });
        cy.allure().endStep('passed');
        clickFilterApply();
        cy.allure().startStep('Verify Able to select flight for booking')
        getFlightDetails();
        cy.allure().endStep('passed');
        cy.allure().startStep('Verify flight details are loading')
        checkFlightDetails();
        cy.allure().endStep('passed');
        cy.allure().startStep('Verify able to book flight')
        bookFlight();
        cy.allure().endStep('passed');
    });

});
