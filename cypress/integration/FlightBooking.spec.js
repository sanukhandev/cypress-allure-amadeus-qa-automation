const {generatePayloadFromExcelRow, jsonToQueryString} = require("./utils");
const flightData = require("../fixtures/Flight.json");
const customerData = require("../fixtures/sampleCustomer.json");
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
    return [...new Set(ids)];
}
describe('Flight Booking', selector_function_selection_elements => {
    let appliedCommercialRuleIDs = [];
    let isAncillaryServicesAvailable = false;
    const interceptBrandedFares = () => {
        cy.intercept('POST', '**/api/v2/offer/brandedfare').as('brandedFares');
    }
    const getFlights = query => {
        cy.visit(`Flight/search?${jsonToQueryString(query)}`);
        cy.wait(2000);
    };
    const clickMorefilters = () => {
        cy.get('div.empireFlight_SortBy', {timeout: 10000}).should('be.visible');
        cy.get('div.empireFlight_filter-lastitem')
            .contains('More Filters')
            .scrollIntoView()
            .click({force: true});

        cy.get('.empireFlight_filter-body').should('be.visible');
    };

    const resetSlider = selectorBaseText => cy.contains('h5.empireFlight_filter-sub-title', selectorBaseText).find('span.empireFlight_filter-reset').click();
    const getFlightDetails = () => {
        interceptBrandedFares();
        cy.get('.empireFlight_ListingBodycontainer').contains('Select').click({force: true});
        cy.wait(1000);
        cy.wait('@brandedFares', {timeout: 30000}).then((interception) => {
            const {body} = interception.response;
            appliedCommercialRuleIDs = getCommercialRuleIDs(body);
            cy.allure().logStep(`Applied commercial rule IDs are ${appliedCommercialRuleIDs.join(', ')}`);
        });
    };
    const adjustSlider = (selectorBaseText, newPosition, direction) => {
        const adjust = ($el) => {
            const elPosition = $el.position();
            cy.wrap($el).trigger('mousedown', {which: 1, pageX: elPosition.left, pageY: elPosition.top}).click();
        };
        cy.contains('h5.empireFlight_filter-sub-title', selectorBaseText).then(($el) => {
            const selector = $el.siblings('div.empireFlight_filter-dropdown-items').find(`.ngx-slider-pointer-${direction}`);
            cy.get(selector).each(($elem) => {
                cy.wrap($elem).invoke('css', 'left', `${newPosition}px`).then(adjust);
            });
        });
    };
    const clickFilterApply = () => {
        cy.get('div.empireFlight_filter-action-head').find('button').contains('Apply').click();
        cy.wait(2000);
    };
    const proceedToPayment = () => {
        cy.get('span').contains('PayFort Gateway ').click();
        cy.get('div').contains('Proceed to Pay').click();
        cy.wait(20000);
        cy.origin('https://sbcheckout.payfort.com/', () => {
            cy.get('input#cardNoInput').type('4005550000000001');
            cy.get('input#chNameInput').type('Test');
            cy.get('input#expDateInput').type('05/25');
            cy.get('input#cvvInput').type('123');
            cy.get('button').contains('Pay').click();
        });
    }

    const interceptBookingConfirmation = () => {
        cy.intercept('POST', '**/api/FlightConfirmation/GetBookingTicketingRes').as('bookingConfirmation');
    }
    const verifyFlightCards = (selector, text) => {
        cy.get(selector)
            .each(($div) => {
                cy.wrap($div).invoke('text').should('match', text);
            });
    };
    const fillNgSelect = (controlName, value) => {
        cy.get('body').then($body => {
            if ($body.find(`ng-select[formcontrolname="${controlName}"]`).length) {
                cy.get(`ng-select[formcontrolname="${controlName}"]`).click();
                cy.get('div.ng-dropdown-panel-items')
                    .find('div.ng-option')
                    .should('be.visible')
                    .contains(value).click();
            } else {
                cy.log(`ng-select with form control name "${controlName}" is not present.`);
            }
        })

    }


    const setDate = (containerClass, dayControl, monthControl, yearControl, day, month, year) => {
        const selectDate = (name, value) => {
            cy.get(`div.${containerClass}`).find(`ng-select[formcontrolname="${name}"]`).click();
            cy.get('div.ng-dropdown-panel-items').find('div.ng-option').contains(value).click();
        };
        cy.get(`div.${containerClass}`).then($e => {
            if ($e.is(':visible')) {
                selectDate(dayControl, day);
                selectDate(monthControl, month);
                selectDate(yearControl, year);
            }
        });
    };
    const logDetails = (details, message) => {
        cy.allure().logStep(`${message} ${details.join(', ')}`);
        console.log(details, message);
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
        console.log(ids, 'ids')
        return ids;
    }
    const checkBookingStatus = () => {
        cy.get('div').contains('Booking Summary').should('be.visible');
        cy.get('h3.empireFlight_confirmBookingStatus')
            .invoke('text')
            .then((text) => cy.allure().logStep(`Booking status is ${text}`));
    }

    const ancillaryServices = () => {
        cy.get('body').then($body => {
            if ($body.find(`div.empireF_Anci`).length) {
                cy.get('div.empireF_Anci').find('div.empireF_AnciSeatTabContent').each(($div) => {
                    cy.get('div.empireF_anciMealBagWrapper').find('button').contains('Add').click();
                    isAncillaryServicesAvailable = true;
                });
            } else {
                cy.log(`Ancillary block not found for the airline.`);
            }
        })
    }

    const verifyAncillaryServices = (context = '') => {
        cy.allure().logStep(`Ancillary services are available on ${context}`);
        cy.allure().startStep(`check ancillary services is added to fare total on ${context}`)
        cy.get('div.empireF_TravelerDetailsText.empireF_TravelerDetailVatTxt').then(($div) => {
            const h4Texts = $div.find('h4').map((index, el) => Cypress.$(el).text()).get();
            if (h4Texts.includes('Baggages')) {
                cy.allure().endStep();
            } else {
                cy.allure().endStep();
                cy.allure().logStep(`Ancillary services is not added to fare total on ${context}`);
            }
        });
    }

    const checkTripDetails = () => {
        cy.get('div.empireFlight_confirmPaytxt > span > span')
            .invoke('text')
            .then((tripId) => cy.allure().logStep(`Trip ID is ${tripId}`));

        cy.get('h4.empireFlight_confirmPnr')
            .invoke('text')
            .then((pnr) => cy.allure().logStep(`PNR is ${pnr}`));
        // Add other assertions or logs if needed
    }

    const checkTicketNumbers = () => {
        cy.get('.empireFlight_Commonhead:contains("Traveller Details")')
            .parents('.empireFlight_CommonCard') // Navigate up to the common card of traveller details
            .find('td:contains("Ticket No.") + td') // Find the TD after "Ticket No."
            .invoke('text') // Get the text content of that td
            .then(ticketNumber => {
                cy.allure().logStep(`Ticket number is ${ticketNumber}`);
            });
    }

    const checkForAddons = () => {
        cy.allure().logStep(`Check for addons`);
        cy.allure().startStep(`Check for addons`);
        cy.get('body').find('div.empireF_Anci').then(($div) => {
            if ($div) {
                cy.allure().endStep();
                cy.allure().logStep(`Addons are available`);
            } else {
                cy.allure().endStep();
                cy.allure().logStep(`Addons are not available`);
            }
        })
    }

    const confirmBooking = () => {
        let confirmedCommercialRuleIDs = [];

        cy.wait('@bookingConfirmation', {timeout: 30000}).then((interception) => {
            const {body} = interception.response;
            confirmedCommercialRuleIDs = getConfirmCommercialRuleIDs(JSON.parse(body.respObj));
            logDetails(confirmedCommercialRuleIDs, 'Confirmed commercial rule IDs are');
        });
        checkBookingStatus();
        checkForAddons();
        checkTripDetails();
        checkTicketNumbers();
    }

    // const fillCustomerDetails = () => {
    //     const {Adults} = customerData;
    //     const {title, first, last, documentNumber, issuingCountry, nationality, email, countryCode, phone} = Adults[0];
    //     cy.get('div.empireF_TravelerFormBody')
    //         .find('ng-select[formcontrolname="Title"]').click()
    //         .find('div.ng-option').contains(title).click();
    //
    //     cy.get('input[formcontrolname="FirstName"]').type(first);
    //     cy.get('input[formcontrolname="LastName"]').type(last);
    //
    //     setDate('empireF_travelerDateofBirth', 'BirthDate', 'BirthMonth', 'BirthYear', '24', 'September', '1993');
    //     cy.get('input[formcontrolname="DocumentNumber"]').type(documentNumber)
    //     fillNgSelect('DocumentIssuingCountry', issuingCountry);
    //     fillNgSelect('Nationality', nationality);
    //     setDate('empireF_pasPortInfo', 'DocumentExpiryDay', 'DocumentExpiryMonth', 'DocumentExpiryYear', '10', 'January', '2028');
    //
    //     cy.get('input[formcontrolname="EmailAddress"]').type(email);
    //     fillNgSelect('phne_code', countryCode);
    //     cy.get('input[formcontrolname="MobileNo"]').type(phone);
    // }

    const fillCustomerDetails = (paxInfo) => {
        const fillPassengerDetails = (passenger, index, type) => {
            const { title, first, last, documentNumber, issuingCountry, nationality, DateOfBirth,DateOfExpriy } = passenger;
            const [DOB, DOM, DOY] = DateOfBirth.split('-');
            const [DEO, DEM, DEY] = DateOfExpriy.split('-');
            cy.get(`h4.empireF_TravelerFormTitle:contains("${type} ${index + 1}")`)
                .parent('div.empireF_TravelerFormBody')
                .within(() => {
                    cy.get('ng-select[formcontrolname="Title"]').click()
                        .find('div.ng-option').contains(title).click();
                    cy.get('input[formcontrolname="FirstName"]').type(first);
                    cy.get('input[formcontrolname="LastName"]').type(last);

                    // I assume setDate is a custom command you have defined elsewhere
                    setDate('empireF_travelerDateofBirth', 'BirthDate', 'BirthMonth', 'BirthYear', DOB, DOM, DOY);
                    cy.get('input[formcontrolname="DocumentNumber"]').type(documentNumber);
                    fillNgSelect('DocumentIssuingCountry', issuingCountry);
                    fillNgSelect('Nationality', nationality);
                    setDate('empireF_pasPortInfo', 'DocumentExpiryDay', 'DocumentExpiryMonth', 'DocumentExpiryYear', DEO, DEM, DEY);

                });
        };
        const [Adults, Children, Infants] = paxInfo.split('|');

        cy.get('div.empireF_TravelerDetails').within(() => {
            for (let i = 0; i < Adults; i++) {
                fillPassengerDetails(customerData.Adults[i], i, 'Adult');
            }
            for (let i = 0; i < Children; i++) {
                fillPassengerDetails(customerData.Children[i], i, 'Child');
            }
            for (let i = 0; i < Infants; i++) {
                fillPassengerDetails(customerData.Infants[i], i, 'Infant');
            }
        });
        cy.get('input[formcontrolname="EmailAddress"]').type('sanu@test.comm');
        fillNgSelect('phne_code', 'United Arab Emirates');
        cy.get('input[formcontrolname="MobileNo"]').type('1234567890');
    }
    const bookFlight = (paxInfo='') => {
        cy.get('.flightDetailText').contains('Book Now').click({force: true});
        cy.wait(2000);

        fillCustomerDetails(paxInfo);
        ancillaryServices();
        if (isAncillaryServicesAvailable) {
            verifyAncillaryServices('Traveler Details Page');
        }
        cy.get('button').find('div').contains('Continue to payment').click();
        cy.wait(2000);

        proceedToPayment();
        interceptBookingConfirmation();
        confirmBooking();
    }

    flightData.map(generatePayloadFromExcelRow).forEach((rowData) => {
        const {scenario, gateway,paxInfo, ...payload } = rowData;

        it(scenario, () => {
            cy.allure().startStep(`${scenario}`)
            getFlights(payload);
            cy.allure().endStep();
            // cy.allure().startStep('Verify flight cards has Emirates')
            // verifyFlightCards('div.empireFlight_FlightNames', /^Emirates\s/);
            cy.allure().endStep();


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
                cy.allure().endStep();
            });

            // Reset all filters
            cy.allure().startStep('Reset all filters')
            clickMorefilters();

            filtersToApply.forEach(({filter}) => {
                resetSlider(filter);
            });
            cy.allure().endStep();
            clickFilterApply();
            cy.allure().startStep('Verify Able to select flight for booking')
            getFlightDetails();
            cy.allure().endStep();
            cy.allure().startStep('Verify able to book flight')
            bookFlight(paxInfo);
            cy.allure().endStep();
        });
    });

});
