Feature: Manga API

  Scenario Outline: Fetch manga by ID and validate fields
    When I fetch the manga by id <id>
    Then I should receive manga details
    And the manga id should be <id>
    And the manga title should not be empty

    Examples:
      | id  |
      | 1   |


  Scenario Outline: Search for manga by name and check results
    When I search for manga with name "<name>"
    Then I should receive a list of manga results
    And at least one result should have a title

    Examples:
      | name      |
      | Naruto    |

  Scenario Outline: Search for manga by partial name
    When I search for manga with name "<partial>"
    Then I should receive a list of manga results
    And at least one result should have a title

    Examples:
      | partial   |
      | Naru      |

  Scenario: Search for manga with gibberish returns empty or error
    When I search for manga with name "asdkjhasd"
    Then I should receive no manga results