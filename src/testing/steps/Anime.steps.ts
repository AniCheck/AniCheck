import { Given, When, Then } from "@cucumber/cucumber";
import assert from "assert";
import { fetchAnime, searchAnime } from "../../anilist/fetchAnime";

let anime: any;
let animeResults: any;

Given("the AniCheck API is available", function () {});

When("I fetch the anime by id {int}", async function (id: number) {
  anime = await fetchAnime(id);
});

Then("I should receive anime details", function () {
  assert.ok(anime, "Anime should be returned");
  assert.ok(anime.title, "Anime should have a title");
  assert.ok(anime.id, "Anime should have an id");
});

Then("I should not receive anime details", function () {
  assert.ok(!anime, "Anime should not be returned for invalid id");
});

Then("the anime id should be {int}", function (expectedId: number) {
  assert.strictEqual(anime.id, expectedId, "Anime id should match");
});

Then("the anime title should not be empty", function () {
  assert.ok(
    anime.title.english && anime.title.english.length > 0,
    "Anime should have a non-empty english title"
  );
});

When("I search for anime with name {string}", async function (name: string) {
  animeResults = await searchAnime(name);
});

Then("I should receive a list of anime results", function () {
  assert.ok(
    Array.isArray(animeResults) || typeof animeResults === "object",
    "Should return a list or object"
  );
});

Then("at least one result should have an english title", function () {
  if (Array.isArray(animeResults)) {
    assert.ok(
      animeResults.some((a) => a.title && a.title.english),
      "At least one result should have an english title"
    );
  } else {
    assert.ok(
      animeResults.title && animeResults.title.english,
      "Result should have an english title"
    );
  }
});

Then("I should receive no anime results", function () {
  if (Array.isArray(animeResults)) {
    assert.strictEqual(animeResults.length, 0, "Anime results should be empty");
  } else {
    assert.ok(
      !animeResults ||
        (Array.isArray(animeResults) && animeResults.length === 0),
      "Anime results should be empty or undefined"
    );
  }
});
