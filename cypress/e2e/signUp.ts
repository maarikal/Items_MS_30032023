import {Given, Then, When} from "@badeball/cypress-cucumber-preprocessor";

Cypress.on('uncaught:exception', () => {
    // returning false here prevents Cypress from
    // failing the test
    return false
})

let email = ''
Given(/^the user navigates to the sign-up page$/, function () {
    cy.visit("https://localhost:5173/signup");
});
When(/^the user enters a valid email and password$/, function () {

    // Generate a random email
    email = Math.random().toString(36).substring(2) + "@asd.ee";

    cy.get("input[name=email]").type(email);
    cy.get("input[name=password]").type("12345678");
});
When(/^clicks the sign-up button$/, function () {
    cy.get("[data-cy=signUp]").click();
});
Then(/^the user is redirected to the sign-in page$/, function () {
    // Check that the user is redirected to the sign-in page
    cy.url().should("include", "/signin");
});
When(/^the user enters an email that is already registered$/, function () {
    cy.get("input[name=email]").type(email);

});
When(/^enters a valid password$/, function () {
    cy.get("input[name=password]").type("12345678");
});
Then(/^an error message is displayed indicating the email is already registered$/, function () {
    cy.get("#email-error").should("contain", "Email already exists");
});
When(/^the user enters a valid email$/, function () {

    // Generate a new random email
    let email2 = Math.random().toString(36).substring(2) + "@asd.ee";

    cy.get("input[name=email]").type(email2);
});
When(/^enters an invalid password$/, function () {
    cy.get("input[name=password]").type("123");
});
Then(/^an error message is displayed indicating the password requirements are not met$/, function () {
    cy.get("#password-error").should("contain", "Password must be at least 8 characters long");
});
