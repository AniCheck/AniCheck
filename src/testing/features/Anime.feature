Feature: Anime API

  Background:
    Given the AniCheck API is available

  Rule: Fetching anime by ID

    Example: Valid IDs return correct anime
      When I fetch the anime by id 1
      Then I should receive anime details
      And the anime id should be 1
      And the anime title should not be empty

    Scenario Outline: Fetch anime by ID and validate fields
      When I fetch the anime by id <id>
      Then I should receive anime details
      And the anime id should be <id>
      And the anime title should not be empty

      Examples:
        | id  |
        | 1   |
        | 21  |
        | 101 |


  Rule: Searching anime

    Scenario Outline: Search for anime by name and check results
      When I search for anime with name "<name>"
      Then I should receive a list of anime results
      And at least one result should have a title

      Examples:
        | name      |
        | Naruto    |

    Scenario Outline: Search for anime by partial name
      When I search for anime with name "<partial>"
      Then I should receive a list of anime results
      And at least one result should have a title

      Examples:
        | partial   |
        | Naru      |

    Scenario: Search for anime with gibberish returns empty or error
      When I search for anime with name "asdkjhasd"
      Then I should receive no anime results