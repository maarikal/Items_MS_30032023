import {Given, When, Then} from "@badeball/cypress-cucumber-preprocessor";

let testUser = {email: 'testuser@gmail.com', password: 'password'}

Given('that I am a logged in user', () => {
    cy.createUser(testUser);
    cy.signIn(testUser);
});

When("I navigate to the {string} page", () => {
    cy.visit('https://localhost:5173/items');
});

When("I click on the {string} button next to the item I want to delete", (buttonText: string) => {
    // Filter the buttons which contains the text "Delete" and click it
    cy.contains("[data-cy=delete]", buttonText).click();
});

Then("the deleted item should no longer be visible on the {string} page", () => {
    cy.visit('https://localhost:5173/items');
    cy.contains("[data-testid=item]", "item to delete").should("not.exist");
});
