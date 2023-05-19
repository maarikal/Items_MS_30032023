import {Given, When, Then} from "@badeball/cypress-cucumber-preprocessor";

Given("that I am a logged in user", () => {
    localStorage.setItem('sessionId', 'bogusSessionIdForTesting');
});

When("I navigate to the {string} page", () => {
    cy.visit('https://127.0.0.1:5173/items');
});

When("I click on the {string} button next to the item I want to delete", (buttonText: string) => {
    // Filter the buttons which contains the text "Delete" and click it
    cy.contains("button", buttonText).click();
});

Then("the deleted item should no longer be visible on the {string} page", () => {
    cy.visit('https://127.0.0.1:5173/items');
    cy.contains("[data-testid=item]", "item to delete").should("not.exist");
});