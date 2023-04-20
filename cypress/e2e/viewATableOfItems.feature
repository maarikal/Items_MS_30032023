Feature: View a Table of Items
  As a logged in user,
  I want to be able to view a table of items

  Scenario: User views a table of items
    Given that I am a logged in user
    When I visit the table of items page
    Then I should see a table of items

  Scenario: Frontend displays item information
    Given that I am a logged in user
    Then the frontend should display the item information on the page