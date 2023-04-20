Feature: Item Update
  As a logged in user
  I want to update an item
  So that I can keep my information up to date

  Scenario: User updates an item
    Given I am logged in as a registered user
    And I am on the "Items" page
    When I click on the "Edit" button next to the item I want to update
    And I update the item's details
    And I click the "Save" button
    Then the item details should be updated