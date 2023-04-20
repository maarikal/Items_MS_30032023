Feature: Delete item
  As a logged in user, I want to delete an item from the website

  Scenario: User deletes an item
    Given that I am a logged in user
    When I navigate to the "Items" page
    And I click on the "Delete" button next to the item I want to delete
    And the deleted item should no longer be visible on the "Items" page
