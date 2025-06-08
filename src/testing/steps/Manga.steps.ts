import { When, Then } from "@cucumber/cucumber";
import assert from "assert";
import { fetchManga } from "../../anilist/fetchManga";

let manga: any;

When("I fetch the manga by id {int}", async function (id: number) {
  manga = await fetchManga(id);
});

Then("I should receive manga details", function () {
  assert.ok(manga);
  assert.ok(manga.title);
  assert.ok(manga.id);
});
