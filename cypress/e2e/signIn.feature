Feature: Sign In to Items list app

  Scenario: User can sign in to the website
    Given the user is on the website
    When the user clicks on the "Sign In" button
    And the user enters their login credentials "silver.sirp@gmail.com", "qwerty1234"
    And clicks the "Sign In" button with id sign-in
    And the user is redirected to the website's items page
    And the user refreshes the page
    Then the user can see the "Sign Out" button
    And the user can see List of items link
    And the user can see Add Item button
    And user cannot see Sign in and Sign out links