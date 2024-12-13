/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
Cypress.Commands.add('loadIngredients', () => {
  cy.intercept('GET', 'api/ingredients', {
    fixture: 'ingredients.json'
  }).as('ingredients');
  cy.visit('/');
  cy.wait('@ingredients');
  cy.get('[data-testid="ingredient-item"]').as('ingredientItem');
});

Cypress.Commands.add('addIngredient', (name: string) => {
  cy.get('@ingredientItem')
    .contains(name)
    .parent()
    .within(() => {
      cy.contains('button', 'Добавить').click();
    });
});

Cypress.Commands.add('getModal', () => cy.get('[data-testid="modal"]'));
