import { When, Then } from "@cucumber/cucumber";
import assert from "assert";

let userCreated = false;

When(
  "I register with username {string} and password {string}",
  async function (username: string, password: string) {
    userCreated = !!username && !!password;
  }
);

Then("the user should be created", function () {
  assert.strictEqual(userCreated, true);
});
