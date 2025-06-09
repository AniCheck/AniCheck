import { When, Then } from "@cucumber/cucumber";
import assert from "assert";

let userCreated = false;
let lastError: string | null = null;
const registeredUsers = new Set<string>();

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

Then("the user should be created", function () {
  assert.strictEqual(userCreated, true);
});

Then("the user should not be created", function () {
  assert.strictEqual(userCreated, false);
});

Then("I should receive a duplicate username error", function () {
  assert.strictEqual(lastError, "Duplicate username");
});
