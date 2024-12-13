declare namespace Cypress {
  interface Chainable {
    loadIngredients(): Chainable<void>;
    getModal(): Chainable<JQuery<HTMLElement>>;
    addIngredient(name: string): Chainable<void>;
  }
}
