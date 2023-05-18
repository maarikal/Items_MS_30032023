Feature: HTTPS Support
  As a user
  I want to use a website with HTTPS support
  So that my data is secure

  Scenario: User accesses the website with HTTPS
    Given the user is on the website
    When the user checks the URL protocol to be https
    Then the user sees the website with HTTPS support