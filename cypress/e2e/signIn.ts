import {Given, Then, When} from "@badeball/cypress-cucumber-preprocessor";
const And = Given;

Given('the user is on the website', () => {
    cy.visit('https://localhost:5173/');
});

When('the user clicks on the "Sign In" button', () => {
    cy.contains('Sign In').click();
});

And('the user enters their login credentials {string}, {string}', (email: string, password: string) => {
    cy.get("input[name=email]").type(email);
    cy.get("input[name=password]").type(password);
});

And('clicks the "Sign In" button with id sign-in', () => {
    cy.get("button#sign-in").click();
});

And('the user is redirected to the website\'s items page', () => {
    cy.visit('https://localhost:5173/items');
});

And("the user refreshes the page", () => {
    cy.reload();
    localStorage.setItem('sessionId', 'bogusSessionIdForTesting');
});

Then('the user can see the "Sign Out" button', () => {
    cy.get("button#sign-out-button").should('be.visible');
});

And("the user can see List of items link", () => {
    cy.get("a#listOfItems").should("be.visible");
});

And('the user can see Add Item button', () => {
    cy.contains('Add Item').should('be.visible');
});

And('user cannot see Sign in and Sign out links', () => {
    cy.get('#sign-in-link').should('not.exist');
    cy.get('#sign-out-link').should('not.exist');
});