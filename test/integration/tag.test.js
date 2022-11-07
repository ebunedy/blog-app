const supertest = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");

beforeEach((done) => {
  jest.setTimeout(60000);
  mongoose.connect(
    process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done()
  );
});

afterEach((done) => {
  mongoose.connection.close(() => done());
});

describe("Tag route", () => {
  it("POST /api/v1/tag/create it should return success message ", async () => {
    const tag = {
      name: "linux",
    };
    const response = await supertest(app).post("/api/v1/tag/create").send(tag);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("tag created successfully");
  });

  it("GET /api/v1/tag/tags it should return all the tags ", async () => {
    const response = await supertest(app).get("/api/v1/tag/tags");
    expect(response.statusCode).toBe(200);
  });

  it("GET /api/v1/tag/javascript it should return post by the tag name ", async () => {
    const response = await supertest(app).get("/api/v1/tag/javascript");
    expect(response.statusCode).toBe(200);
  });

  it("UPDATE /api/v1/tag/update/6356f305676e46a177ef9e5a it should delete the tag with this id ", async () => {
    const tag = {
      name: "Javascript",
    };
    const response = await supertest(app)
      .patch("/api/v1/tag/update/6356f305676e46a177ef9e5a")
      .send(tag);
    expect(response.statusCode).toBe(200);
  });

  it("DELETE /api/v1/tag/delete/6356e2bd9cb3f98ce6ecc1d6 it should delete the tag with this id ", async () => {
    const response = await supertest(app).delete(
      "/api/v1/tag/delete/6356e2bd9cb3f98ce6ecc1d6"
    );
    expect(response.statusCode).toBe(200);
  });
});
