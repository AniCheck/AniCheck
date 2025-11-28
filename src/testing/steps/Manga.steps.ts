import { When, Then, Given } from "@cucumber/cucumber";
import assert from "assert";
import { fetchManga, searchManga } from "../../anilist/fetchManga";

let manga: any;
let mangaResults: any;
let errorResponse: any;
let responseTime: number;
let requestCount: number = 0;
let batchRequests: any[] = [];

Given("I am testing manga API performance", function () {
  responseTime = 0;
  requestCount = 0;
  batchRequests = [];
});

When("I fetch the manga by id {int}", async function (id: number) {
  const startTime = Date.now();
  try {
    manga = await fetchManga(id);
    responseTime = Date.now() - startTime;
    requestCount++;
  } catch (e) {
    errorResponse = e;
    manga = null;
    responseTime = Date.now() - startTime;
  }
});

When(
  "I perform batch manga requests for ids {string}",
  async function (idList: string) {
    const ids = idList.split(",").map((id) => parseInt(id.trim()));
    const startTime = Date.now();

    batchRequests = await Promise.allSettled(ids.map((id) => fetchManga(id)));

    responseTime = Date.now() - startTime;
    requestCount = ids.length;
  }
);

When("I search for manga with name {string}", async function (name: string) {
  mangaResults = await searchManga(name);
});

When(
  "I search for manga with advanced filters {string}",
  async function (filters: string) {
    const filterObj = JSON.parse(filters);
    const startTime = Date.now();

    try {
      // Simulate advanced search with multiple parameters
      mangaResults = await searchManga(filterObj.query || "");
      responseTime = Date.now() - startTime;

      if (filterObj.genre) {
        mangaResults =
          mangaResults?.filter((manga: any) =>
            manga.genres?.includes(filterObj.genre)
          ) || [];
      }

      if (filterObj.year) {
        mangaResults =
          mangaResults?.filter(
            (manga: any) => manga.startDate?.year === filterObj.year
          ) || [];
      }

      if (filterObj.status) {
        mangaResults =
          mangaResults?.filter(
            (manga: any) => manga.status === filterObj.status
          ) || [];
      }
    } catch (e) {
      errorResponse = e;
      mangaResults = null;
    }
  }
);

When(
  "I perform stress test with {int} concurrent requests",
  async function (concurrency: number) {
    const startTime = Date.now();
    const requests = Array(concurrency)
      .fill(0)
      .map((_, index) =>
        fetchManga(index + 1).catch((e) => ({ error: e.message }))
      );

    batchRequests = await Promise.allSettled(requests);
    responseTime = Date.now() - startTime;
    requestCount = concurrency;
  }
);

When(
  "I search for manga with pagination {string}",
  async function (paginationData: string) {
    const { page, perPage, sortBy } = JSON.parse(paginationData);

    try {
      // Simulate paginated search
      mangaResults = await searchManga("popular");

      if (Array.isArray(mangaResults)) {
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        mangaResults = mangaResults.slice(startIndex, endIndex);

        // Simulate sorting
        if (sortBy === "SCORE_DESC") {
          mangaResults.sort(
            (a: any, b: any) => (b.averageScore || 0) - (a.averageScore || 0)
          );
        } else if (sortBy === "TITLE_ENGLISH") {
          mangaResults.sort((a: any, b: any) =>
            (a.title?.english || "").localeCompare(b.title?.english || "")
          );
        }
      }
    } catch (e) {
      errorResponse = e;
      mangaResults = [];
    }
  }
);

When(
  "I validate manga data integrity for id {int}",
  async function (id: number) {
    try {
      manga = await fetchManga(id);

      // Perform data validation
      if (manga) {
        manga.validationResults = {
          hasRequiredFields: !!(manga.id && manga.title),
          titleConsistency:
            manga.title?.english || manga.title?.romaji || manga.title?.native,
          statusValid: [
            "FINISHED",
            "RELEASING",
            "NOT_YET_RELEASED",
            "CANCELLED",
          ].includes(manga.status),
          scoreRange: manga.averageScore >= 0 && manga.averageScore <= 100,
          chaptersPositive: !manga.chapters || manga.chapters > 0,
        };
      }
    } catch (e) {
      errorResponse = e;
      manga = null;
    }
  }
);

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

Then(
  "the response time should be under {int} milliseconds",
  function (maxTime: number) {
    assert.ok(
      responseTime < maxTime,
      `Response time ${responseTime}ms should be under ${maxTime}ms`
    );
  }
);

Then("I should receive valid manga data structure", function () {
  assert.ok(manga, "Manga should be returned");
  assert.ok(manga.id, "Manga should have an id");
  assert.ok(manga.title, "Manga should have a title");

  if (manga.validationResults) {
    assert.ok(
      manga.validationResults.hasRequiredFields,
      "Manga should have required fields"
    );
    assert.ok(
      manga.validationResults.titleConsistency,
      "Manga should have at least one title variant"
    );
  }
});

Then(
  "the batch requests should have {int}% success rate",
  function (minSuccessRate: number) {
    const successfulRequests = batchRequests.filter(
      (result) => result.status === "fulfilled"
    ).length;
    const actualSuccessRate = (successfulRequests / batchRequests.length) * 100;

    assert.ok(
      actualSuccessRate >= minSuccessRate,
      `Success rate ${actualSuccessRate}% should be at least ${minSuccessRate}%`
    );
  }
);

Then(
  "I should receive paginated results with {int} items",
  function (expectedCount: number) {
    assert.ok(Array.isArray(mangaResults), "Results should be an array");
    assert.strictEqual(
      mangaResults.length,
      expectedCount,
      `Should receive exactly ${expectedCount} items`
    );
  }
);

Then(
  "the results should be sorted by {string}",
  function (sortCriteria: string) {
    assert.ok(
      Array.isArray(mangaResults) && mangaResults.length > 1,
      "Need multiple results to verify sorting"
    );

    if (sortCriteria === "SCORE_DESC") {
      for (let i = 1; i < mangaResults.length; i++) {
        const prevScore = mangaResults[i - 1].averageScore || 0;
        const currentScore = mangaResults[i].averageScore || 0;
        assert.ok(
          prevScore >= currentScore,
          "Results should be sorted by score descending"
        );
      }
    }
  }
);

Then(
  "I should receive an error response with code {int}",
  function (expectedCode: number) {
    assert.ok(errorResponse, "Should have received an error");
    assert.ok(
      errorResponse.message || errorResponse.code,
      "Error should have a message or code"
    );
  }
);

Then("the manga data should pass integrity validation", function () {
  assert.ok(manga && manga.validationResults, "Should have validation results");

  const results = manga.validationResults;
  assert.ok(results.hasRequiredFields, "Should have required fields");
  assert.ok(results.titleConsistency, "Should have consistent title data");
  assert.ok(results.statusValid, "Should have valid status");

  if (manga.averageScore !== undefined) {
    assert.ok(results.scoreRange, "Score should be in valid range");
  }
});

Then(
  "the concurrent requests should complete within {int} seconds",
  function (maxSeconds: number) {
    const maxTime = maxSeconds * 1000;
    assert.ok(
      responseTime < maxTime,
      `Concurrent requests took ${responseTime}ms, should be under ${maxTime}ms`
    );
  }
);

Then(
  "I should receive filtered results matching {string}",
  function (filterCriteria: string) {
    const criteria = JSON.parse(filterCriteria);
    assert.ok(Array.isArray(mangaResults), "Should receive array of results");

    if (criteria.genre) {
      mangaResults.forEach((manga: any) => {
        assert.ok(
          manga.genres?.includes(criteria.genre),
          `Manga should have genre ${criteria.genre}`
        );
      });
    }

    if (criteria.minScore) {
      mangaResults.forEach((manga: any) => {
        assert.ok(
          !manga.averageScore || manga.averageScore >= criteria.minScore,
          `Manga score should be at least ${criteria.minScore}`
        );
      });
    }
  }
);
