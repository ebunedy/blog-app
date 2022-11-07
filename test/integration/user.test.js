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

describe("User route", () => {
  it("GET /api/v1/user/profile it should return user profile ", async () => {
    const response = await supertest(app).get("/api/v1/user/profile");
    expect(response.status).toBe(200);
  });

  it("GET /api/v1/user/profile/63623bb1e377ccf2829ead62 it should return user public profile ", async () => {
    const response = await supertest(app).get(
      "/api/v1/user/profile/63623bb1e377ccf2829ead62"
    );
    expect(response.status).toBe(200);
  });

  it("GET /api/v1/user/update it should update user", async () => {
    const newUpdate = {
      email: "edy@gmail.com",
    };
    const response = await (
      await supertest(app).patch("/api/v1/user/update")
    ).send(newUpdate);
    expect(response.status).toBe(200);
  });

  it("GET /api/v1/user/delete/63623bb1e377ccf2829ead62 it should delete user", async () => {
    const response = await await supertest(app).delete(
      "/api/v1/user/delete/63623bb1e377ccf2829ead62"
    );
    expect(response.status).toBe(200);
  });
});
