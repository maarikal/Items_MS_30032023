// cypress/support/index.d.ts

declare namespace Cypress {
    interface Chainable {
        createUser(user: any): void;

        signIn(user: any): void;
    }
}
