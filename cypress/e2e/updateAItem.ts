import {Given, When, Then} from "@badeball/cypress-cucumber-preprocessor";

let testUser = {email: 'testuser@gmail.com', password: 'password'}

Given('that I am a logged in user', () => {
    cy.createUser(testUser);
    cy.signIn(testUser);
});

When('I am on the "Items" page', () => {
    cy.visit('https://localhost:5173/items');
});

When("I click on the {string} button next to the item I want to update", (buttonText: string) => {
    cy.visit('https://localhost:5173/items');
    cy.contains(buttonText).click();
});

When("I update the item's details", () => {
    cy.get("input[name=name]").clear().type("Updated Item");
    cy.get("input[name=description]").clear().type("This is an updated item");
    cy.get("input[name=image]").clear().type("https://shorturl.at/aijsQ");
});

When("I click the {string} button", () => {
    cy.get("[data-cy=updateItem]").click();
});

Then("the item details should be updated", () => {
    cy.contains("Updated Item").should("exist");
    cy.contains("This is an updated item").should("exist");
});