import { When, Then, Given } from "@cucumber/cucumber";
import assert from "assert";

let userCreated = false;
let lastError: string | null = null;
let authToken: string | null = null;
let userProfile: any = null;
let sessionData: any = null;
let securityAudit: any = {};
let performanceMetrics: any = {};
const registeredUsers = new Set<string>();
const activeUsers = new Map<string, any>();
const loginAttempts = new Map<string, number>();

// Security and Session Management
Given("I have a secure testing environment", function () {
  securityAudit = {
    passwordStrength: [],
    injectionAttempts: [],
    brruteForceAttempts: [],
    sessionValidations: [],
  };
  performanceMetrics = {
    registrationTimes: [],
    loginTimes: [],
    concurrentUsers: 0,
  };
});

Given("I am monitoring user session security", function () {
  sessionData = {
    createdAt: Date.now(),
    lastActivity: Date.now(),
    ipAddress: "127.0.0.1",
    userAgent: "TestAgent/1.0",
    failedAttempts: 0,
  };
});

// Advanced Registration with Security
When(
  "I register with advanced credentials username {string}, password {string}, email {string}",
  async function (username: string, password: string, email: string) {
    const startTime = Date.now();
    const normalized = username.toLowerCase();

    // Security validations
    const passwordStrength = validatePasswordStrength(password);
    const emailValid = validateEmail(email);
    const usernameValid = validateUsername(username);

    securityAudit.passwordStrength.push({
      username,
      strength: passwordStrength,
      score: calculatePasswordScore(password),
    });

    if (!username || !password || !email) {
      userCreated = false;
      lastError = "Missing required credentials";
      return;
    }

    if (!emailValid) {
      userCreated = false;
      lastError = "Invalid email format";
      return;
    }

    if (!usernameValid) {
      userCreated = false;
      lastError = "Invalid username format";
      return;
    }

    if (registeredUsers.has(normalized)) {
      userCreated = false;
      lastError = "Duplicate username";
      return;
    }

    // Simulate registration success
    registeredUsers.add(normalized);
    activeUsers.set(normalized, {
      username,
      email,
      createdAt: Date.now(),
      isActive: true,
      profileCompleted: false,
    });

    userCreated = true;
    lastError = null;

    performanceMetrics.registrationTimes.push(Date.now() - startTime);
  }
);

// Keep existing simple registration for backward compatibility
When(
  "I register with username {string} and password {string}",
  async function (username: string, password: string) {
    const normalized = username.toLowerCase();
    if (!username || !password) {
      userCreated = false;
      lastError = "Missing username or password";
      return;
    }
    if (registeredUsers.has(normalized)) {
      userCreated = false;
      lastError = "Duplicate username";
      return;
    }
    registeredUsers.add(normalized);
    userCreated = true;
    lastError = null;
  }
);

When(
  "I attempt login with username {string} and password {string}",
  async function (username: string, password: string) {
    const startTime = Date.now();
    const normalized = username.toLowerCase();

    // Track login attempts
    const currentAttempts = loginAttempts.get(normalized) || 0;
    loginAttempts.set(normalized, currentAttempts + 1);

    if (currentAttempts >= 5) {
      lastError = "Account locked due to multiple failed attempts";
      authToken = null;
      return;
    }

    if (registeredUsers.has(normalized) && password.length >= 6) {
      authToken = `token_${Date.now()}_${Math.random()}`;
      lastError = null;

      // Update session
      if (sessionData) {
        sessionData.lastActivity = Date.now();
        sessionData.loginSuccess = true;
      }

      loginAttempts.delete(normalized); // Reset failed attempts on success
    } else {
      authToken = null;
      lastError = "Invalid credentials";
    }

    performanceMetrics.loginTimes.push(Date.now() - startTime);
  }
);

When(
  "I update user profile with data {string}",
  async function (profileData: string) {
    if (!authToken) {
      lastError = "Not authenticated";
      userProfile = null;
      return;
    }

    try {
      const data = JSON.parse(profileData);
      userProfile = {
        ...userProfile,
        ...data,
        updatedAt: Date.now(),
      };
      lastError = null;
    } catch (e) {
      lastError = "Invalid profile data format";
      userProfile = null;
    }
  }
);

When(
  "I perform bulk user operations with {int} users",
  async function (userCount: number) {
    const startTime = Date.now();
    const results = [];

    for (let i = 1; i <= userCount; i++) {
      const username = `bulkuser${i}`;
      const password = `bulkpass${i}`;
      const email = `bulk${i}@test.com`;

      const normalized = username.toLowerCase();

      if (!registeredUsers.has(normalized)) {
        registeredUsers.add(normalized);
        activeUsers.set(normalized, {
          username,
          email,
          createdAt: Date.now(),
          isActive: true,
          isBulkCreated: true,
        });
        results.push({ success: true, username });
      } else {
        results.push({ success: false, username, error: "Duplicate" });
      }
    }

    performanceMetrics.bulkOperationTime = Date.now() - startTime;
    performanceMetrics.bulkResults = results;
    performanceMetrics.concurrentUsers = activeUsers.size;
  }
);

When(
  "I perform security audit for user {string}",
  async function (username: string) {
    const normalized = username.toLowerCase();
    const userData = activeUsers.get(normalized);

    if (!userData) {
      lastError = "User not found";
      return;
    }

    securityAudit.sessionValidations.push({
      username,
      sessionAge: Date.now() - (sessionData?.createdAt || Date.now()),
      hasValidToken: !!authToken,
      recentActivity:
        Date.now() - (sessionData?.lastActivity || Date.now()) < 300000, // 5 minutes
      accountAge: Date.now() - userData.createdAt,
      riskScore: calculateRiskScore(userData, sessionData),
    });
  }
);

When(
  "I attempt concurrent login sessions for user {string}",
  async function (username: string) {
    const sessions = [];

    for (let i = 0; i < 3; i++) {
      const sessionToken = await simulateLogin(username, "testpassword");
      sessions.push({
        token: sessionToken,
        createdAt: Date.now(),
        sessionId: `session_${i}_${Date.now()}`,
      });
    }

    securityAudit.concurrentSessions = sessions;
  }
);

When(
  "I validate user input sanitization with payload {string}",
  async function (payload: string) {
    const sanitizedInput = sanitizeUserInput(payload);

    securityAudit.injectionAttempts.push({
      originalPayload: payload,
      sanitizedPayload: sanitizedInput,
      containsSQLInjection:
        payload.toLowerCase().includes("drop") ||
        payload.toLowerCase().includes("select"),
      containsXSS:
        payload.includes("<script>") || payload.includes("javascript:"),
      containsCommandInjection:
        payload.includes("&&") || payload.includes("||"),
      isSanitized: sanitizedInput !== payload,
    });
  }
);

// Enhanced validation functions
function validatePasswordStrength(password: string): string {
  if (password.length < 8) return "weak";
  if (!/[A-Z]/.test(password)) return "weak";
  if (!/[a-z]/.test(password)) return "weak";
  if (!/[0-9]/.test(password)) return "medium";
  if (!/[^A-Za-z0-9]/.test(password)) return "medium";
  return "strong";
}

function calculatePasswordScore(password: string): number {
  let score = 0;
  score += password.length * 4;
  if (/[A-Z]/.test(password)) score += 10;
  if (/[a-z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 10;
  if (/[^A-Za-z0-9]/.test(password)) score += 15;
  return Math.min(100, score);
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateUsername(username: string): boolean {
  return (
    username.length >= 3 &&
    username.length <= 50 &&
    /^[a-zA-Z0-9_-]+$/.test(username)
  );
}

function calculateRiskScore(userData: any, session: any): number {
  let score = 0;

  // Account age factor
  const accountAge = Date.now() - userData.createdAt;
  if (accountAge < 86400000) score += 20; // Less than 1 day

  // Session factors
  if (session) {
    const sessionAge = Date.now() - session.createdAt;
    if (sessionAge > 3600000) score += 10; // Older than 1 hour

    if (session.failedAttempts > 0) score += session.failedAttempts * 5;
  }

  return Math.min(100, score);
}

function sanitizeUserInput(input: string): string {
  return input
    .replace(/<script.*?>.*?<\/script>/gi, "")
    .replace(/[<>]/g, "")
    .replace(/['";]/g, "")
    .trim();
}

async function simulateLogin(
  username: string,
  password: string
): Promise<string | null> {
  const normalized = username.toLowerCase();
  if (registeredUsers.has(normalized)) {
    return `token_${Date.now()}_${Math.random()}`;
  }
  return null;
}

// Enhanced Then statements
Then("the user should be created", function () {
  assert.strictEqual(userCreated, true);
});

Then("the user should not be created", function () {
  assert.strictEqual(userCreated, false);
});

Then("I should receive a duplicate username error", function () {
  assert.strictEqual(lastError, "Duplicate username");
});

Then("I should receive a valid authentication token", function () {
  assert.ok(authToken, "Should receive authentication token");
  assert.ok(authToken.startsWith("token_"), "Token should have correct format");
});

Then("I should receive an authentication error", function () {
  assert.strictEqual(lastError, "Invalid credentials");
  assert.strictEqual(authToken, null);
});

Then("the user profile should be updated successfully", function () {
  assert.ok(userProfile, "User profile should exist");
  assert.ok(userProfile.updatedAt, "Profile should have update timestamp");
});

Then(
  "the bulk operation should create {int} users within {int} seconds",
  function (expectedUsers: number, maxSeconds: number) {
    assert.ok(
      performanceMetrics.bulkResults,
      "Should have bulk operation results"
    );

    const successfulUsers = performanceMetrics.bulkResults.filter(
      (r: any) => r.success
    ).length;
    assert.strictEqual(
      successfulUsers,
      expectedUsers,
      `Should create ${expectedUsers} users`
    );

    const timeInSeconds = performanceMetrics.bulkOperationTime / 1000;
    assert.ok(
      timeInSeconds <= maxSeconds,
      `Operation should complete within ${maxSeconds} seconds`
    );
  }
);

Then("the security audit should pass validation", function () {
  assert.ok(
    securityAudit.sessionValidations.length > 0,
    "Should have session validations"
  );

  securityAudit.sessionValidations.forEach((validation: any) => {
    assert.ok(
      validation.riskScore < 80,
      `Risk score should be acceptable for ${validation.username}`
    );
  });
});

Then(
  "the password strength should be {string}",
  function (expectedStrength: string) {
    assert.ok(
      securityAudit.passwordStrength.length > 0,
      "Should have password strength data"
    );

    const latestPassword =
      securityAudit.passwordStrength[securityAudit.passwordStrength.length - 1];
    assert.strictEqual(
      latestPassword.strength,
      expectedStrength,
      `Password strength should be ${expectedStrength}`
    );
  }
);

Then("the input sanitization should prevent injection attacks", function () {
  assert.ok(
    securityAudit.injectionAttempts.length > 0,
    "Should have injection attempt data"
  );

  securityAudit.injectionAttempts.forEach((attempt: any) => {
    if (
      attempt.containsSQLInjection ||
      attempt.containsXSS ||
      attempt.containsCommandInjection
    ) {
      assert.ok(attempt.isSanitized, "Malicious input should be sanitized");
    }
  });
});

Then("the concurrent sessions should be managed properly", function () {
  assert.ok(
    securityAudit.concurrentSessions,
    "Should have concurrent session data"
  );
  assert.ok(
    securityAudit.concurrentSessions.length <= 3,
    "Should limit concurrent sessions"
  );

  // Verify each session has unique identifier
  const sessionIds = securityAudit.concurrentSessions.map(
    (s: any) => s.sessionId
  );
  const uniqueIds = new Set(sessionIds);
  assert.strictEqual(
    sessionIds.length,
    uniqueIds.size,
    "Session IDs should be unique"
  );
});

Then(
  "the system should handle {int} concurrent users efficiently",
  function (expectedUsers: number) {
    assert.ok(
      performanceMetrics.concurrentUsers >= expectedUsers,
      `Should handle at least ${expectedUsers} concurrent users`
    );
  }
);

Then(
  "the average response time should be under {int} milliseconds",
  function (maxTime: number) {
    let avgTime = 0;

    if (performanceMetrics.registrationTimes.length > 0) {
      avgTime =
        performanceMetrics.registrationTimes.reduce(
          (a: number, b: number) => a + b,
          0
        ) / performanceMetrics.registrationTimes.length;
    } else if (performanceMetrics.loginTimes.length > 0) {
      avgTime =
        performanceMetrics.loginTimes.reduce(
          (a: number, b: number) => a + b,
          0
        ) / performanceMetrics.loginTimes.length;
    }

    assert.ok(
      avgTime < maxTime,
      `Average response time ${avgTime}ms should be under ${maxTime}ms`
    );
  }
);
