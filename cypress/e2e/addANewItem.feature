Feature: Add new item
  As a logged in user, I want to add a new item to the website

  Scenario: User adds a new item
    Given that I am a logged in user
    When I navigate to the "Add Item" page
    And I fill in the item details
    And I submit the item form
    And the new item should be visible on the "Items" page