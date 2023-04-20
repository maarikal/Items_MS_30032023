import {Given, When, Then} from "@badeball/cypress-cucumber-preprocessor";

Given("I am logged in as a registered user", () => {
    // perform the necessary actions to log in the user
});

Given("I am on the {string} page", () => {
    cy.visit('http://127.0.0.1:5173/items');
});

When("I click on the {string} button next to the item I want to update", (buttonText: string) => {
    cy.contains(buttonText).click();
});

When("I update the item's details", () => {
    cy.get("input[name=name]").clear().type("Updated Item");
    cy.get("input[name=description]").clear().type("This is an updated item");
    cy.get("input[name=image]").clear().type("https://shorturl.at/aijsQ");
});

When("I click the {string} button", () => {
    cy.get("button#update-item").click();
});

Then("the item details should be updated", () => {
    cy.contains("Updated Item").should("exist");
    cy.contains("This is an updated item").should("exist");
});
