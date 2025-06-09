Feature: User API

  Scenario Outline: Register new users
    When I register with username "<username>" and password "<password>"
    Then the user should be created

    Examples:
      | username | password  |
      | alice    | pass123   |
      | bob      | secret456 |

  Scenario: Register with missing password
    When I register with username "failuser" and password ""
    Then the user should not be created

  Scenario: Register two users with the same username
    When I register with username "duplicateuser" and password "pass1"
    And I register with username "duplicateuser" and password "pass2"
    Then I should receive a duplicate username error

  Scenario: Register two users with similar names (case-insensitive)
    When I register with username "CaseUser" and password "pass1"
    And I register with username "caseuser" and password "pass2"
    Then I should receive a duplicate username error

  Scenario: Register user with special characters in username
    When I register with username "user!@#" and password "pass123"
    Then the user should be created