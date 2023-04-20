import {Given, Then, When} from "@badeball/cypress-cucumber-preprocessor";

Given("that I am a logged in user", () => {
    // This step is a no-op since we don't need to do anything to simulate being a user
});

When("I visit the table of items page", () => {
    cy.visit("http://localhost:5173/items");
});

Then("I should see a table of items", () => {
    cy.get("table").should("exist");
});

Then("the frontend should display the item information on the page", () => {
    cy.visit("http://localhost:5173/items");

    // Ensure that the item information is displayed correctly on the page
    cy.get("table").should("exist");

    cy.get("table th").eq(1).should("contain", "Item");
    cy.get("table th").eq(3).should("contain", "Image");
    cy.get("table th").eq(2).should("contain", "Description");

    cy.get("table td").eq(1).should("exist");
    cy.get("table td img").eq(3).should("exist");
    cy.get("table td").eq(2).should("exist");
});