const apiUrl = Cypress.env('BURGER_API_URL');
describe('Burger Constructor', () => {
  beforeEach(() => {
    cy.setCookie(
      'accessToken',
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    );
    cy.setCookie(
      'refreshToken',
      'c854c28fdc6accc55e2e1324dbb76c2e6e27e306ac26fdda33b31d606710566f5c57496620fc9185'
    );

    cy.intercept('GET', '/auth/user', {
      statusCode: 200,
      body: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        accessToken: 'mock-access-token'
      }
    }).as('checkAuth');

    cy.intercept('POST', `${apiUrl}/orders`, {
      statusCode: 200,
      headers: {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      },
      body: {
        success: true,
        name: 'Краторный био-марсианский бургер',
        order: {
          ingredients: [
            {
              _id: '643d69a5c3f7b9001cfa093c',
              name: 'Краторная булка N-200i',
              type: 'bun',
              proteins: 80,
              fat: 24,
              carbohydrates: 53,
              calories: 420,
              price: 1255,
              image: 'https://code.s3.yandex.net/react/code/bun-02.png',
              image_mobile:
                'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
              image_large:
                'https://code.s3.yandex.net/react/code/bun-02-large.png',
              __v: 0
            },
            {
              _id: '643d69a5c3f7b9001cfa0941',
              name: 'Биокотлета из марсианской Магнолии',
              type: 'main',
              proteins: 420,
              fat: 142,
              carbohydrates: 242,
              calories: 4242,
              price: 424,
              image: 'https://code.s3.yandex.net/react/code/meat-01.png',
              image_mobile:
                'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
              image_large:
                'https://code.s3.yandex.net/react/code/meat-01-large.png',
              __v: 0
            }
          ],
          _id: '1',
          owner: {
            name: 'Test User',
            email: 'test@example.com',
            createdAt: '2024-09-21T20:44:30.309Z',
            updatedAt: '2024-10-06T05:04:41.136Z'
          },
          status: 'done',
          name: 'Краторный био-марсианский бургер',
          createdAt: '2024-12-09T18:53:01.122Z',
          updatedAt: '2024-12-09T18:53:01.983Z',
          number: 62088,
          price: 1679
        }
      }
    }).as('createOrder');

    cy.visit('localhost:4000/');
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
  });

  it('Оформление заказа', () => {
    cy.wait('@checkAuth');
    cy.getCookie('accessToken');
    cy.getCookie('refreshToken');
    cy.url().should('not.include', '/login');
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
    //здесь ошибка 403 при создании заказа, не понимаю как исправить
    cy.wait('@createOrder', { timeout: 20000 });
    cy.get('[data-testid="modal"]').should('exist');
    cy.get('[data-testid="order-details-ui"]').should('exist');
    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="constructor-ingredient"]').should('have.length', 0);
  });
});
