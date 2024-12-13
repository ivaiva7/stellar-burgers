describe('Burger Constructor', () => {
  beforeEach(() => {
    cy.loadIngredients();
  });

  it('Добавление ингредиента в конструктор', () => {
    const ingredientName = 'Краторная булка N-200i';
    cy.addIngredient(ingredientName);
    cy.get('[data-testid="constructor-ingredient"]')
      .first()
      .contains(ingredientName);
  });

  it('Открытие и закрытие модального окна ингредиента', () => {
    cy.get('@ingredientItem').first().click();
    cy.getModal().should('exist');
    cy.get('[data-testid="modal-close"]').click();
    cy.getModal().should('not.exist');
  });
});

describe('оформление заказа работает корректно', function () {
  beforeEach(function () {
    cy.loadIngredients();
    cy.get('[data-testid="order-button"]').as('orderButton');
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'post-order.json' }).as(
      'postOrder'
    );
    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refreshToken')
    );
    cy.setCookie('accessToken', 'test-accessToken');
  });

  it('Оформление заказа', () => {
    cy.addIngredient('Краторная булка N-200i');
    cy.addIngredient('Биокотлета из марсианской Магнолии');
    cy.get('@orderButton').click();
    cy.wait('@postOrder')
      .its('request.body')
      .should('deep.equal', {
        ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941']
      });
    cy.getModal()
      .should('exist')
      .first()
      .within(() => {
        cy.get('[data-testid="modal-close"]').click({ force: true });
      });
    cy.getModal().should('not.exist');

    cy.get('[data-testid="burger-constructor"]').within(() => {
      cy.get('[data-testid="constructor-ingredient"]')
        .contains('Выберите булку')
        .should('exist');
      cy.get('[data-testid="constructor-area"]')
        .contains('Выберите начинку')
        .should('exist');
    });

    cy.get('@orderButton').should('exist');
    cy.get('@orderButton').click();
    cy.getModal().should('not.exist');
  });
  afterEach(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
});
