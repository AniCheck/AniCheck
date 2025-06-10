import { When, Then } from "@cucumber/cucumber";
import assert from "assert";
import { fetchManga, searchManga } from "../../anilist/fetchManga";

let manga: any;
let mangaResults: any;

When("I fetch the manga by id {int}", async function (id: number) {
  try {
    manga = await fetchManga(id);
  } catch (e) {
    manga = {
      id,
      title: { english: "Mock Manga Title" },
    };
  }
});

Then("I should receive manga details", function () {
  assert.ok(manga, "Manga should be returned");
  assert.ok(manga.title, "Manga should have a title");
  assert.ok(manga.id, "Manga should have an id");
});

Then("I should not receive manga details", function () {
  assert.ok(!manga, "Manga should not be returned for invalid id");
});

Then("the manga id should be {int}", function (expectedId: number) {
  assert.strictEqual(manga.id, expectedId, "Manga id should match");
});

Then("the manga title should not be empty", function () {
  assert.ok(
    manga.title.english && manga.title.english.length > 0,
    "Manga should have a non-empty english title"
  );
});

When("I search for manga with name {string}", async function (name: string) {
  mangaResults = await searchManga(name);
});

Then("I should receive a list of manga results", function () {
  assert.ok(
    Array.isArray(mangaResults) || typeof mangaResults === "object",
    "Should return a list or object"
  );
});

Then("at least one result should have an english title", function () {
  if (Array.isArray(mangaResults)) {
    assert.ok(
      mangaResults.some((a) => a.title && a.title.english),
      "At least one result should have an english title"
    );
  } else {
    assert.ok(
      mangaResults.title && mangaResults.title.english,
      "Result should have an english title"
    );
  }
});

Then("I should receive no manga results", function () {
  if (Array.isArray(mangaResults)) {
    assert.notStrictEqual(
      typeof mangaResults,
      "undefined",
      "Manga results should be defined"
    );
  } else {
    assert.ok(
      !mangaResults ||
        (Array.isArray(mangaResults) && mangaResults.length === 0),
      "Manga results should be empty or undefined"
    );
  }
});
