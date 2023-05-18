import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("the user is on the website", () => {
  cy.visit("https://localhost:5173");
});

// When the user checks the URL protocol
When("the user checks the URL protocol to be https", () => {
  cy.location("protocol").should("eq", "https:");
}
);

// Then the user sees the website with HTTPS support
Then("the user sees the website with HTTPS support", () => {
    cy.visit("https://localhost:5173");
}
);