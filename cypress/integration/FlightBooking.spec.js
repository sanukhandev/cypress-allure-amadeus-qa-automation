const {generatePayloadFromExcelRow, jsonToQueryString, defalutOWpayloadQuery} = require("./utils");
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
    console.log(ids, 'ids' )
    return [...new Set(ids)];
}
describe('Flight Booking', () => {
    let appliedCommercialRuleIDs = [];

    const interceptBrandedFares = () => {
        cy.intercept('POST', '**/api/v2/offer/brandedfare').as('brandedFares');
    }
    const getFlights = query => {
        cy.visit(`Flight/search?${jsonToQueryString(query)}`);
        cy.wait(2000);
    };
    const clickMorefilters = () => {
        cy.get('div.empireFlight_SortBy', {timeout: 10000}).should('be.visible');
        cy.get('div.empireFlight_filter-lastitem').contains('More Filters').click();
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
        const adjust = ($el, position) => {
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


    const verifyFlightCards = (selector, text) => {
        cy.get(selector)
            .each(($div) => {
                cy.wrap($div).invoke('text').should('match', text);
            });
    };
    const fillNgSelect = (controlName, value) => {
        cy.get(`ng-select[formcontrolname="${controlName}"]`).click()
            .find('div.ng-dropdown-panel-items')
            .find('div.ng-option')
            .contains(value).click();
    }
    const setDate = (containerClass, dayControl, monthControl, yearControl, day, month, year) => {
        const selectDate = (name, value) => {
            cy.get(`div.${containerClass}`).find(`ng-select[formcontrolname="${name}"]`).click();
            cy.get('div.ng-dropdown-panel-items').find('div.ng-option').contains(value).click();
        };
        selectDate(dayControl, day);
        selectDate(monthControl, month);
        selectDate(yearControl, year);
    };
    const bookFlight = () => {
        const { Adults } = customerData;
        const { title, first, last, documentNumber, issuingCountry, nationality, email, countryCode, phone } = Adults[0];

        cy.get('.flightDetailText').contains('Book Now').click({ force: true });
        cy.wait(2000);
        cy.get('div.empireF_TravelerFormBody')
            .find('ng-select[formcontrolname="Title"]').click()
            .find('div.ng-option').contains(title).click();

        cy.get('input[formcontrolname="FirstName"]').type(first);
        cy.get('input[formcontrolname="LastName"]').type(last);

        setDate('empireF_travelerDateofBirth', 'BirthDate', 'BirthMonth', 'BirthYear', '24', 'September', '1993');
        cy.get('input[formcontrolname="DocumentNumber"]').type(documentNumber)
        fillNgSelect('DocumentIssuingCountry', issuingCountry);
        fillNgSelect('Nationality', nationality);
        setDate('empireF_pasPortInfo', 'DocumentExpiryDay', 'DocumentExpiryMonth', 'DocumentExpiryYear', '10', 'January', '2028');

        cy.get('input[formcontrolname="EmailAddress"]').type(email);
        fillNgSelect('phne_code', countryCode);
        cy.get('input[formcontrolname="MobileNo"]').type(phone);

        cy.get('button').find('div').contains('Continue to payment').click();

        proceedToPayment();
        // interceptBookingConfirmation();
        // confirmBooking();
    }

    flightData.map(generatePayloadFromExcelRow).forEach((rowData) => {
        const {scenario, gateway, ...payload} = rowData;
        it(scenario, () => {
            cy.allure().startStep(`${scenario}`)
            getFlights(payload);
            cy.allure().endStep();
            cy.allure().startStep('Verify flight cards has Emirates')
            verifyFlightCards('div.empireFlight_FlightNames', /^Emirates\s/);
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
            bookFlight();
            cy.allure().endStep();
        });
    });

});
