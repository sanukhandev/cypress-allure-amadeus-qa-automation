describe('Test Suite', () => {
    before(() => {
        cy.log('Before all tests');
    });

    beforeEach(() => {
        cy.log('Before each test');
    });

    it('Test Case', () => {
        // Your test case here...
    });

    afterEach(() => {
        cy.log('After each test');
    });

    after(() => {
        cy.log('After all tests');
    });
});
