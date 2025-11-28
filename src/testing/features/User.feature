Feature: Advanced User Management & Security
  As a security-conscious application administrator  
  I want to comprehensively test user management operations
  So that I can ensure robust authentication, authorization, and data protection

  Background:
    Given the AniCheck API is available
    And I have a secure testing environment

  # Enhanced Registration & Authentication
  Scenario: Advanced user registration with comprehensive validation
    When I register with advanced credentials username "secureuser", password "ComplexP@ss123!", email "secure@test.com"
    Then the user should be created
    And the password strength should be "strong"

  Scenario: User authentication with session management
    Given I am monitoring user session security
    When I register with username "authuser" and password "AuthPass123!"
    And I attempt login with username "authuser" and password "AuthPass123!"
    Then I should receive a valid authentication token
    And the security audit should pass validation

  Scenario: Advanced user profile management
    Given I am monitoring user session security
    When I register with username "profileuser" and password "ProfilePass123!"
    And I attempt login with username "profileuser" and password "ProfilePass123!"
    And I update user profile with data '{"firstName": "John", "lastName": "Doe", "preferences": {"theme": "dark", "language": "en"}}'
    Then the user profile should be updated successfully

  # Security & Injection Testing
  Scenario: SQL injection prevention in user registration
    When I validate user input sanitization with payload "admin'; DROP TABLE users; --"
    Then the input sanitization should prevent injection attacks

  Scenario: XSS prevention in user data
    When I validate user input sanitization with payload "<script>alert('xss')</script>admin"
    Then the input sanitization should prevent injection attacks

  Scenario: Command injection prevention testing
    When I validate user input sanitization with payload "user && rm -rf / --no-preserve-root"
    Then the input sanitization should prevent injection attacks

  # Advanced Authentication Security
  Scenario: Account lockout after multiple failed login attempts
    When I register with username "locktest" and password "LockTest123!"
    And I attempt login with username "locktest" and password "wrongpass1"
    And I attempt login with username "locktest" and password "wrongpass2"
    And I attempt login with username "locktest" and password "wrongpass3"
    And I attempt login with username "locktest" and password "wrongpass4"
    And I attempt login with username "locktest" and password "wrongpass5"
    And I attempt login with username "locktest" and password "LockTest123!"
    Then I should receive an authentication error

  Scenario: Concurrent session management and security
    When I register with username "concurrent" and password "Concurrent123!"
    And I attempt concurrent login sessions for user "concurrent"
    Then the concurrent sessions should be managed properly

  # Performance & Load Testing  
  Scenario: Bulk user registration performance testing
    When I perform bulk user operations with 50 users
    Then the bulk operation should create 50 users within 5 seconds
    And the system should handle 50 concurrent users efficiently

  Scenario: User registration performance monitoring
    When I register with username "perfuser1" and password "Performance123!"
    And I register with username "perfuser2" and password "Performance123!"
    And I register with username "perfuser3" and password "Performance123!"
    Then the average response time should be under 200 milliseconds

  # Advanced Security Auditing
  Scenario: Comprehensive user security audit
    Given I am monitoring user session security
    When I register with username "audituser" and password "AuditPass123!"
    And I attempt login with username "audituser" and password "AuditPass123!"
    And I perform security audit for user "audituser"
    Then the security audit should pass validation

  # Edge Cases & Boundary Testing
  Scenario: Registration with weak password validation
    When I register with advanced credentials username "weakuser", password "123", email "weak@test.com"
    Then the user should not be created
    And the password strength should be "weak"

  Scenario: Registration with invalid email format
    When I register with advanced credentials username "emailtest", password "EmailTest123!", email "invalid-email"
    Then the user should not be created

  Scenario: Registration with special characters and internationalization
    When I register with advanced credentials username "международный", password "国际密码123!", email "интернационал@тест.com"
    Then the user should be created

  # Legacy compatibility tests (keeping existing simple tests)
  Scenario: Simple user creation with standard credentials
    When I register with username "standarduser" and password "mypass123"
    Then the user should be created

  Scenario: Prevent duplicate usernames
    When I register with username "unique" and password "pass1"
    Then the user should be created
    When I register with username "unique" and password "pass2"
    Then the user should not be created

  Scenario: Handle emoji and Unicode characters in usernames
    When I register with username "test😀user" and password "emojitest"
    Then the user should be created

  Scenario: Security injection attempts in usernames
    When I register with username "<script>alert('test')</script>" and password "scripttest"
    Then the user should be created

  Scenario: SQL injection attempt in username
    When I register with username "test'; DROP TABLE users;--" and password "sqltest"
    Then the user should be created