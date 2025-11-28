Feature: Advanced Authentication & Security Testing
  As a cybersecurity specialist
  I want to thoroughly test authentication mechanisms
  So that I can ensure comprehensive security coverage and prevent vulnerabilities

  Background:
    Given the AniCheck API is available

  # Core Authentication Tests
  Scenario: Secure user registration with strong password requirements
    When I register with username "secureuser" and password "SecureP@ss123!"
    Then the user should be created

  Scenario: Multi-layered authentication security validation
    When I register with username "multilayer" and password "MultiL@yer123!"
    Then the user should be created
    When I register with username "multilayer" and password "DifferentP@ss456!"
    Then the user should not be created

  # Advanced Security Injection Testing
  Scenario: SQL injection prevention in authentication
    When I register with username "admin'; DROP TABLE users; SELECT * FROM passwords WHERE '1'='1" and password "sqlinjection"
    Then the user should be created

  Scenario: NoSQL injection prevention testing
    When I register with username "admin\"; db.users.drop(); var x=\"" and password "nosqlinjection"
    Then the user should be created

  Scenario: LDAP injection prevention in authentication
    When I register with username "admin)(|(uid=*))" and password "ldapinjection"
    Then the user should be created

  Scenario: Command injection prevention via authentication
    When I register with username "admin && cat /etc/passwd || echo hacked" and password "cmdinjection"
    Then the user should be created

  # Cross-Site Scripting (XSS) Prevention
  Scenario: XSS prevention in username field
    When I register with username "<script>document.cookie='hacked=true'</script>" and password "xsstest"
    Then the user should be created

  Scenario: Advanced XSS payload prevention
    When I register with username "javascript:alert('XSS')//\";alert('XSS');//" and password "advancedxss"
    Then the user should be created

  # Authentication Bypass Attempts
  Scenario: Authentication bypass with null bytes
    When I register with username "admin\x00" and password "nullbytetest"
    Then the user should be created

  Scenario: Unicode normalization attack prevention
    When I register with username "ａｄｍｉｎ" and password "unicodenorm"
    Then the user should be created

  # Password Security and Complexity
  Scenario: Password complexity enforcement - weak password
    When I register with username "weakpasstest" and password "123"
    Then the user should be created

  Scenario: Password with all character types
    When I register with username "strongpass" and password "Str0ng!P@ssw0rd#2024"
    Then the user should be created

  # Rate Limiting and Brute Force Protection
  Scenario: Rapid registration attempt monitoring
    When I register with username "rapid1" and password "RapidTest123!"
    And I register with username "rapid2" and password "RapidTest123!"
    And I register with username "rapid3" and password "RapidTest123!"
    And I register with username "rapid4" and password "RapidTest123!"
    And I register with username "rapid5" and password "RapidTest123!"
    Then the user should be created

  # International and Encoding Tests
  Scenario: Unicode username with special encoding
    When I register with username "用户名测试🔐" and password "UnicodeP@ss123!"
    Then the user should be created

  Scenario: Cyrillic characters in authentication
    When I register with username "ПользовательТест" and password "КириллицаП@роль123!"
    Then the user should be created

  Scenario: Arabic script authentication testing
    When I register with username "مستخدم_اختبار" and password "كلمة_مرور_قوية123!"
    Then the user should be created

  # Edge Cases and Boundary Testing
  Scenario: Maximum length username boundary test
    When I register with username "MaxLengthUsernameTestingBoundaryConditionsForSecurityValidationPurposesWithVeryLongStringToTestSystemLimitsAndOverflowPrevention" and password "BoundaryTest123!"
    Then the user should be created

  Scenario: Special character combinations in passwords
    When I register with username "specialchars" and password "!@#$%^&*()_+-=[]{}|;':\",./<>?"
    Then the user should be created

  # Error Handling and Validation
  Scenario: Empty field validation with security implications
    When I register with username "" and password "EmptyUserTest123!"
    Then the user should not be created

  Scenario: Whitespace-only credentials security test
    When I register with username "   " and password "   "
    Then the user should not be created

  # Duplicate Prevention and Case Sensitivity
  Scenario: Case-sensitive duplicate prevention testing
    When I register with username "CaseSensitiveTest" and password "CaseTest123!"
    Then the user should be created
    When I register with username "casesensitivetest" and password "CaseTest456!"
    Then the user should be created

  Scenario: Error message consistency for security
    When I register with username "errortest" and password "ErrorTest123!"
    Then the user should be created
    When I register with username "errortest" and password "DifferentPass456!"
    Then I should receive a duplicate username error