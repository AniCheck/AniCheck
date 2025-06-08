import { When, Then } from "@cucumber/cucumber";
import assert from "assert";
import { fetchAnime } from "../../anilist/fetchAnime";

let anime: any;

When("I fetch the anime by id {int}", async function (id: number) {
  anime = await fetchAnime(id);
});

Then("I should receive anime details", function () {
  assert.ok(anime);
  assert.ok(anime.title);
  assert.ok(anime.id);
});
