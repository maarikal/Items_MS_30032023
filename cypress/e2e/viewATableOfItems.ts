import {Given, Then, When} from "@badeball/cypress-cucumber-preprocessor";

Given("that I am a logged in user", () => {
    localStorage.setItem('sessionId', 'bogusSessionIdForTesting');
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

Given("that I am not a logged in user", () => {
    localStorage.removeItem('sessionId');
});

Then("I should not see a table of items", () => {
    cy.get("table").should("not.exist");
});