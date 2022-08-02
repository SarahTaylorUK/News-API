const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

afterAll(() => db.end());

beforeEach(() => {
  return seed(data);
});

describe("GET api/topics", () => {
  test("returns an array", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.articles)).toBe(true);
      });
  });
  test("returns an array of objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((item) => {
          return expect(item).toBeInstanceOf(Object);
        });
      });
  });
  test("objects contain the slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((item) => {
          return expect(item.hasOwnProperty("slug")).toBe(true);
        });
        body.articles.forEach((item) => {
          return expect(item.hasOwnProperty("description")).toBe(true);
        });
        body.articles.forEach((item) => {
          expect(item).toEqual(
            expect.objectContaining({
              slug: expect.anything(),
              description: expect.anything(),
            })
          );
        });
      });
  });
});

describe("ALL /*", () => {
  test("responds with 404 not found when given non-existent endpoint", () => {
    return request(app)
      .get("/api/nonsense")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Route not found" });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("returns an object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.article)).toBe(false);
        expect(typeof body.article).toBe("object");
      });
  });
  test("object contains following properties: article_id, author, title, body, topic, created_at, votes", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: expect.anything(),
            author: expect.anything(),
            title: expect.anything(),
            body: expect.anything(),
            topic: expect.anything(),
            created_at: expect.anything(),
            votes: expect.anything(),
          })
        );
      });
  });
  test("Bad request- invalid- returns 400 bad request", () => {
    return request(app)
      .get("/api/articles/bananas")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("Bad request- valid but out of range- returns 404 object not found", () => {
    return request(app)
      .get("/api/articles/900000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Object not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("takes an object and returns the updated article object", () => {
    const input = { inc_votes: 3 };
    const originArticle1 = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 100,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.updatedArticle).toBe("object");
        expect(Array.isArray(body.updatedArticle)).toBe(false);
        expect(body.updatedArticle).toBeInstanceOf(Object);
        expect(body.updatedArticle).not.toEqual(originArticle1);
      });
  });
  test("increments the votes with a positive number", () => {
    const input = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(200)
      .then(({ body }) => {
        const updatedArticle = body.updatedArticle;
        expect(updatedArticle.votes).toBe(110);
      });
  });
  test("decrements the votes with a negative number", () => {
    const input = { inc_votes: -10 };
    return request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(200)
      .then(({ body }) => {
        const updatedArticle = body.updatedArticle;
        expect(updatedArticle.votes).toBe(90);
      });
  });
  test("wrong format of input returns 400 bad request", () => {
    const input = { nonsense: 3 };
    return request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("invalid value input returns 400 bad request", () => {
    const input = { inc_votes: "nonsense" };
    return request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("accesses the correct article", () => {
    const input = { inc_votes: 0 };
    return request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedArticle.article_id).toBe(1);
      });
  });
  test("valid but out of range article returns 404 not found", () => {
    const input = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/900")
      .send(input)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Object not found");
      });
  });
  test("invalid article value returns 400 bad request", () => {
    const input = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/nonsense")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("responds with an array of objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.users)).toBe(true);
        body.users.forEach((item) => {
          return expect(item).toBeInstanceOf(Object);
        });
      });
  });
  test("contains the properties: username, name, avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        body.users.forEach((item) => {
          expect(item).toEqual(
            expect.objectContaining({
              username: expect.anything(),
              name: expect.anything(),
              avatar_url : expect.anything()
            })
          );
        });
      });
  });
});
