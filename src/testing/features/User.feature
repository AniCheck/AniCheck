Feature: User API

  Scenario: Register a new user
    When I register with username "testuser" and password "testpass"
    Then the user should be created