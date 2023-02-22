// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.add('getPaymentGatewayPage', (selector, value) => {
    cy.get('iframe')
        .should((iframe) => expect(iframe.contents().find(selector)).to.exist)
        .then((iframe) => cy.wrap(iframe.contents().find(selector)))
        .within((input) => {
            cy.wrap(input).should('not.be.disabled').clear().type(value)
        })
})

Cypress.Commands.add('isExistElement', selector => {
    cy.get('body').then(($el) => {
        if ($el.has(selector)) {
            return true
        } else {
            return false
        }
    })
});
