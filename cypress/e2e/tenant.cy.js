describe('Tenant E2E tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays default tenant', () => {
    cy.contains('Tesla 中国').should('be.visible');
  });

  it('opens tenant switcher and selects a tenant', () => {
    cy.get('[data-testid="tenant-switcher"]').within(() => {
      cy.get('select').select('t-002');
    });
    cy.contains('Tesla US').should('be.visible');
  });
});
