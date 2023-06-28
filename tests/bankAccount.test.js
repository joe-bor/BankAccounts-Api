require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const server = app.listen(8000, () => {
  console.log("Testing on PORT 8000");
});

const User = require("../models/user");
const Account = require("../models/account");
const Transaction = require("../models/transaction");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.connection.close();
  mongoServer.stop();
  server.close();
});

describe("Testing the user-endpoints of bank accounts api", () => {
  test('It should create a new "user" document', async () => {
    const response = await request(app).post("/users/signup").send({
      name: "joe bor",
      email: "Joe-email",
      password: "Joe-password!",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.user.name).toEqual("Joe Bor");
    expect(response.body.user.email).toEqual("joe-email");
    expect(response.body.user.isLoggedIn).toBe(false);
  });

  test("It should return the list of users", async () => {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.any(Object));
  });

  test("It should log in the user", async () => {
    const response = await request(app).post("/users/login").send({
      email: "Joe-email",
      password: "Joe-password!",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.user.isLoggedIn).toBe(true);
    expect(response.body).toHaveProperty("token");
  });

  test("It should show a user", async () => {
    const user = new User({
      name: "Ethan",
      email: "Ethan-email",
      password: "Ethan-password!",
      isLoggedIn: true,
    });
    await user.save();
    const token = await user.generateAuthToken();
    const response = await request(app)
      .get(`/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.user.name).toEqual("Ethan");
    expect(response.body.user.email).toEqual("ethan-email");
  });

  //delete
  test("It should delete a user", async () => {
    const user = new User({
      name: "Nick Daly",
      email: "Nick-email",
      password: "N!ck-password",
      isLoggedIn: true,
    });
    await user.save();
    const token = await user.generateAuthToken();

    const response = await request(app)
      .delete(`/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
  });

  //update
  test("It should update a user", async () => {
    const user = new User({
      name: "Jacob Zagorenko",
      email: "jacob-email",
      password: "jacob-password!",
      isLoggedIn: true,
    });
    await user.save();
    const token2 = await user.generateAuthToken();

    const response = await request(app)
      .put(`/users/${user._id}`)
      .set("Authorization", `Bearer ${token2}`)
      .send({
        name: "Z. Jacob",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.user.name).toEqual("Z. Jacob");
  });

  //logout
  test("It should logout the user", async () => {
    const user = new User({
      name: "Michael T",
      email: "michael-email",
      password: "michael-password!",
      isLoggedIn: true,
    });
    await user.save();
    const token = await user.generateAuthToken();

    const response = await request(app)
      .post("/users/logout")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
  });
});

// Factory
async function createAuthorizedUser(uniqueEmail) {
  const user = new User({
    name: "Test",
    email: uniqueEmail,
    password: "Test-password!",
    isLoggedIn: true,
  });
  await user.save();
  const token = await user.generateAuthToken();
  return { user, token };
}

// Test suite for Accounts
describe("Testing the accounts-endpoints of the api", () => {
  test('It should create a new "account" document', async () => {
    const { user, token } = await createAuthorizedUser("Test-email1");
    console.log(user);
    console.log(token);
  });

  //Index
  // test("It should return a list of all the accounts", async () => {});
});

//Delete

//Update

//Show

//*Test suit for transactions

// index

// create

// show
