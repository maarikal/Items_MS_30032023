import {Given, When, Then} from "@badeball/cypress-cucumber-preprocessor";

let itemName = ''

Given('that I am a logged in user', () => {
    // perform the necessary actions to log in the user
});

When('I navigate to the "Add Item" page', () => {
    cy.visit('http://127.0.0.1:5173/modify');
});

When('I fill in the item details', () => {
    itemName = Math.random().toString(36).substring(2);

    cy.get('input[name=name]').type(itemName);
    cy.get('input[name=description]').type('This is a new item');
    cy.get('input[name=image]').type('https://shorturl.at/aijsQ');
});

When('I submit the item form', () => {
    cy.get("button#add-item").click();
});

Then('the new item should be visible on the "Items" page', () => {
    cy.visit('http://127.0.0.1:5173/items');
    cy.contains('New Item');
});