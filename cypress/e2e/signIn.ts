import {Given, Then, When} from "@badeball/cypress-cucumber-preprocessor";

const And = Given;

let testUser = {email: 'testuser@gmail.com', password: 'password'}

Given('the user is on the website', () => {
    cy.createUser(testUser);
    cy.visit('https://localhost:5173/');
});

When('the user clicks on the "Sign In" button', () => {
    cy.contains('Sign In').click();
});

And('the user enters their login credentials {string}, {string}', () => {
    cy.get("input[name=email]").type(testUser.email);
    cy.get("input[name=password]").type(testUser.password);
});

And('clicks the "Sign In" button with id sign-in', () => {
    cy.get("button[data-cy=signIn]").click();
});

And('the user is redirected to the website\'s items page', () => {

});

Then('the user can see the "Sign Out" link', () => {
    cy.get('[data-cy=logOut]').should('be.visible');
});

And("the user can see List of items link", () => {
    cy.get("[data-cy=listOfItems]").should("be.visible");
});

And('the user can see Add Item button', () => {
    cy.contains('Add Item').should('be.visible');
});

And('user cannot see Sign in and Sign out links', () => {
    cy.get('#sign-in-link').should('not.exist');
    cy.get('#sign-out-link').should('not.exist');
});