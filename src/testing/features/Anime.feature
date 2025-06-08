Feature: Anime API

  Scenario: Fetch anime by ID
    When I fetch the anime by id 1
    Then I should receive anime details