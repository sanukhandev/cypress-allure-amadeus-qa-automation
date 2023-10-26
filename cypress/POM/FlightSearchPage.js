import BasePage from "./BasePage";

class FlightPage extends BasePage {
    constructor() {
        super();
        this.appliedCommercialRuleIDs = [];
    }

    get flightListingContainer() { return cy.get('.empireFlight_ListingBodycontainer'); }
    get sortByComponent() { return cy.get('div.empireFlight_SortBy', { timeout: 10000 }); }
    get filterComponent() { return cy.get('div.empireFlight_filter-lastitem', { timeout: 10000 }); }
    get filterBody() { return cy.get('.empireFlight_filter-body'); }
    get applyBtn() { return cy.get('div.empireFlight_filter-action-head').find('button').contains('Apply'); }

    verifyFlightCards(selector, text) {
        this.find(selector)
            .each(($div) => {
                cy.wrap($div).invoke('text').should('match', text);
            });
    }

    clickMorefilters() {
        this.sortByComponent.should('be.visible');
        this.filterComponent.should('be.visible')
            .contains('More Filters')
            .scrollIntoView()
            .click({ force: true });
        this.filterBody.should('be.visible');
    }

    resetSlider(selectorBaseText) {
        cy.contains('h5.empireFlight_filter-sub-title', selectorBaseText).find('span.empireFlight_filter-reset').click();
    }

    adjustSlider(selectorBaseText, newPosition, direction) {
        const selector = cy.contains('h5.empireFlight_filter-sub-title', selectorBaseText)
            .siblings('div.empireFlight_filter-dropdown-items').find(`.ngx-slider-pointer-${direction}`);

        selector.each(($elem) => {
            const elPosition = $elem.position();
            cy.wrap($elem).invoke('css', 'left', `${newPosition}px`)
                .trigger('mousedown', { which: 1, pageX: elPosition.left, pageY: elPosition.top })
                .click();
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

    getFlightDetails() {
        this.flightListingContainer.contains('Select').click({ force: true });
        this.interceptBrandedFares()
        cy.wait('@brandedFares', { timeout: 30000 }).then((interception) => {
            const { body } = interception.response;
            this.getCommercialRuleIDs(body);
            cy.allure().logStep(`Applied commercial rule IDs are ${this.appliedCommercialRuleIDs.join(', ')}`);
        });
    }

    interceptBrandedFares() {
        cy.intercept('POST', '**/api/v2/offer/brandedfare').as('brandedFares');
    }

    clickFilterApply() {
        this.applyBtn.click();
        cy.wait(2000);
    }
}

export default FlightPage;
