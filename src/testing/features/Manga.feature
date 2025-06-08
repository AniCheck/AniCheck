Feature: Manga API

  Scenario: Fetch manga by ID
    When I fetch the manga by id 1
    Then I should receive manga details