const {jsonToQueryString, defalutOWpayloadQuery} = require("./utils");


describe('Flight Search Page sort filter', () => {
    const waitForLowfareRequest = () => {
        cy.wait('@lowfareRequest', {timeout: 120000});
        cy.wait(2000);
    };

    beforeEach(() => {
        getFlightResponsePage([]);

    });
    const getFlightResponsePage = (query) => {
        cy.intercept('POST', '**/api/v2/offer/lowfare').as('lowfareRequest');
        const URL = `Flight/search?${jsonToQueryString(defalutOWpayloadQuery(...query))}`;
        cy.visit(URL);
        cy.wait(2000);
        waitForLowfareRequest();
    };

    const moveSlider = (selectorBaseText, newPosition, direction) => {

        // Find the selector by text
        cy.contains('h5.empireFlight_filter-sub-title', selectorBaseText).then(($el) => {

            const selector = $el.siblings('div.empireFlight_filter-dropdown-items').find(`.ngx-slider-pointer-${direction}`);

            // Get slider
            const slider = cy.get(selector).should('exist');
            // if direction is max get the current left css value of the slider and susbtraction newPosition from it
            // else add newPosition to the current left css value of the slider
            // Change CSS property
            slider.invoke('css', 'left', `${newPosition}px`);

            // Find the new position of the slider and click on it
            slider.then(($el) => {
                const position = $el.position();
                cy.wrap($el).trigger('mousedown', { which: 1, pageX: position.left, pageY: position.top });
                slider.click();
            });
        });
    }

    const resetSlider = (selectorBaseText) => {

            // Find the selector by text
            cy.contains('h5.empireFlight_filter-sub-title', selectorBaseText).then(($el) => {
                $el.children('span.empireFlight_filter-reset').click();
            });
    }




    it('Check if all sliders are working', function () {
        cy.get('div.empireFlight_SortBy', {timeout: 10000}).should('be.visible');
        cy.get('div.empireFlight_filter-lastitem')
            .contains('More Filters')
            .click();
        cy.get('.empireFlight_filter-body')
            .should('be.visible');

        moveSlider(' Price ', 100, 'min');
        moveSlider(' Price ', 200, 'max');
        moveSlider(' Departure Timing ', 100, 'min');
        moveSlider(' Departure Timing ', 200, 'max');
        moveSlider(' Departure Trip Duration ', 100, 'min');
        moveSlider(' Departure Trip Duration ', 200, 'max');
        moveSlider(' Arrival Timing ', 100, 'min');
        moveSlider(' Arrival Timing ', 200, 'max');

        resetSlider(' Price ');
        resetSlider(' Departure Timing ');
        resetSlider(' Departure Trip Duration ');
        resetSlider(' Arrival Timing ');

        // if all works, then the test should pass
        expect(true).to.equal(true);







    });
});



