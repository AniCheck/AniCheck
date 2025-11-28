Feature: Advanced Manga CRUD Operations
  As a manga enthusiast and API consumer
  I want to perform comprehensive manga operations
  So that I can efficiently discover, validate, and manage manga data

  Background:
    Given the AniCheck API is available

  # Basic CRUD Operations
  Scenario: GET manga with performance monitoring
    Given I am testing manga API performance
    When I fetch the manga by id 1
    Then I should receive valid manga data structure
    And the response time should be under 2000 milliseconds

  Scenario: GET manga with data integrity validation
    When I validate manga data integrity for id 1
    Then the manga data should pass integrity validation
    And I should receive valid manga data structure

  Scenario: GET manga with error handling for non-existent ID
    When I fetch the manga by id 999999
    Then I should receive an error response with code 404

  # Advanced Search Operations
  Scenario: GET manga with advanced filtering
    When I search for manga with advanced filters '{"query": "One Piece", "genre": "Action", "minScore": 80}'
    Then I should receive filtered results matching '{"genre": "Action", "minScore": 80}'
    And I should receive a list of manga results

  Scenario: GET manga with pagination and sorting
    When I search for manga with pagination '{"page": 1, "perPage": 5, "sortBy": "SCORE_DESC"}'
    Then I should receive paginated results with 5 items
    And the results should be sorted by "SCORE_DESC"

  Scenario: GET manga search with complex filters
    When I search for manga with advanced filters '{"query": "romance", "status": "FINISHED", "year": 2020}'
    Then I should receive a list of manga results

  # Performance and Load Testing
  Scenario: Batch manga retrieval performance test
    Given I am testing manga API performance
    When I perform batch manga requests for ids "1, 2, 3, 4, 5"
    Then the batch requests should have 60% success rate
    And the response time should be under 5000 milliseconds

  Scenario: Concurrent request stress testing
    Given I am testing manga API performance
    When I perform stress test with 10 concurrent requests
    Then the concurrent requests should complete within 10 seconds
    And the batch requests should have 50% success rate

  # Edge Cases and Security Testing
  Scenario: GET manga search with malicious input sanitization
    When I search for manga with name "'; DROP TABLE manga; SELECT * FROM users WHERE '1'='1"
    Then I should receive a list of manga results

  Scenario: GET manga search with Unicode and special characters
    When I search for manga with name "進撃の巨人 & マンガ検索 🔍"
    Then I should receive a list of manga results

  Scenario: GET manga with extremely large ID boundary testing
    When I fetch the manga by id 2147483647
    Then I should receive an error response with code 404

  # Data Validation and Business Logic
  Scenario: GET manga search with empty results validation
    When I search for manga with name "nonexistentmangaquery12345xyz"
    Then I should receive no manga results

  Scenario: GET manga search performance with single character
    Given I am testing manga API performance
    When I search for manga with name "a"
    Then I should receive a list of manga results
    And the response time should be under 3000 milliseconds

  # International and Localization Testing
  Scenario: GET manga search with Japanese title
    When I search for manga with name "鬼滅の刃"
    Then I should receive a list of manga results
    And at least one result should have an english title