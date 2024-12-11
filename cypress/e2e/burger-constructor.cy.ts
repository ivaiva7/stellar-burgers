describe('Burger Constructor', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    });
    cy.visit('http://localhost:4000');
  });

  it('Добавление ингредиента в конструктор', () => {
    const ingredientName = 'Краторная булка N-200i';
    cy.get('[data-testid="ingredient-item"]')
      .should('exist')
      .contains('Краторная булка N-200i')
      .parent()
      .within(() => {
        cy.contains('button', 'Добавить').click();
      });
    cy.get('[data-testid="constructor-ingredient"]')
      .first()
      .contains(ingredientName);
  });

  it('Открытие и закрытие модального окна ингредиента', () => {
    cy.get('[data-testid="ingredient-item"]').first().click();
    cy.get('[data-testid="modal"]').should('exist');
    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');
  });
});

describe('оформление заказа работает корректно', function () {
  beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    });
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'post-order.json' }).as(
      'postOrder'
    );
    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refreshToken')
    );
    cy.setCookie('accessToken', 'test-accessToken');
    cy.visit('http://localhost:4000');
  });

  it('Оформление заказа', () => {
    cy.get('[data-testid="ingredient-item"]')
      .should('exist')
      .first()
      .within(() => {
        cy.contains('button', 'Добавить').click();
      });
    cy.get('[data-testid="ingredient-item"]')
      .contains('Биокотлета из марсианской Магнолии')
      .parent()
      .within(() => {
        cy.contains('button', 'Добавить').click();
      });
    cy.get('[data-testid="order-button"]').click();
    cy.wait('@postOrder')
      .its('request.body')
      .should('deep.equal', {
        ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941']
      });
    cy.get('[data-testid="modal"]')
      .should('exist')
      .first()
      .within(() => {
        cy.get('[data-testid="modal-close"]').click({ force: true });
      });
    cy.get('[data-testid="modal"]').should('not.exist');

    cy.get('[data-testid="burger-constructor"]').within(() => {
      cy.get('[data-testid="constructor-ingredient"]')
        .contains('Выберите булку')
        .should('exist');
      cy.get('[data-testid="constructor-area"]')
        .contains('Выберите начинку')
        .should('exist');
    });

    cy.get('[data-testid="order-button"]').should('exist');
    cy.get('[data-testid="order-button"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');
  });
  afterEach(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
});
