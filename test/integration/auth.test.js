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
  it("GET / it should response the get method ", async () => {
    const response = await supertest(app).get("/");
    expect(response.statusCode).toBe(200);
  });

  it("POST /api/v1/user-auth/register it should return user creation ", async () => {
    const user = {
      first_name: "New name",
      last_name: "namelove",
      email: "a@gmail.com",
      password: "test23488",
    };
    const response = await supertest(app)
      .post("/api/v1/user-auth/register")
      .send(user);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe("New name");
  });

  it("POST /api/v1/user-auth/login it log user in ", async () => {
    const user = {
      email: "a@gmail.com",
      password: "test23488",
    };
    const response = await supertest(app)
      .post("api/v1/user-auth/login")
      .send(user);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("user logged in successfully");
  });
});
