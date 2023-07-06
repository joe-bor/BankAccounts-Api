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

/*********************************************************/

// Factory
async function createAuthorizedUser() {
  const user = new User({
    name: "Test",
    email: "test-email",
    password: "Test-password!",
    isLoggedIn: true,
  });
  await user.save();
  const token = await user.generateAuthToken();
  return { user, token };
}

async function createAccountForAuthUser() {
  const { user, token } = await createAuthorizedUser();
  const account = new Account({
    name: "Test-Account",
    category: "checking",
    balance: 600,
    owner: user._id,
  });
  await account.save();
  user.accounts.push(account);
  await user.save();
  return { user, token, account };
}

async function createTransactionForAccountOfAuthUser() {
  const { user, token, account } = await createAccountForAuthUser();
  const transaction = new Transaction({
    category: "deposit",
    description: "Monthly Recurring Revenue",
    amount: 200,
    forAccount: account,
  });
  await transaction.save();
  return { user, token, account, transaction };
}

/***************************************************************/
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
    const { user, token } = await createAuthorizedUser();
    const response = await request(app)
      .get(`/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.user.name).toEqual("Test");
    expect(response.body.user.email).toEqual("test-email");
  });

  //delete
  test("It should delete a user", async () => {
    const { user, token } = await createAuthorizedUser();

    const response = await request(app)
      .delete(`/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
  });

  //update
  test("It should update a user", async () => {
    const { user, token } = await createAuthorizedUser();

    const response = await request(app)
      .put(`/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated. Test",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.user.name).toEqual("Updated. Test");
  });

  //logout
  test("It should logout the user", async () => {
    const { user, token } = await createAuthorizedUser();

    const response = await request(app)
      .post("/users/logout")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
  });
});

// Test suite for Accounts
describe("Testing the accounts-endpoints of the api", () => {
  //Index
  test("It should return a list of all the accounts", async () => {
    // creates users w/ accounts
    const { user, token } = await createAuthorizedUser();
    await createAccountForAuthUser();
    await createAccountForAuthUser();

    const response = await request(app)
      .get("/accounts")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("paginatedAccounts");
    expect(response.body.paginatedAccounts).toHaveProperty("totalResults");
    expect(response.body.paginatedAccounts).toHaveProperty("page");
    expect(response.body.paginatedAccounts).toHaveProperty("accounts");
  });

  //Create
  test('It should create a new "account" document', async () => {
    const { user, token } = await createAuthorizedUser();
    const response = await request(app)
      .post("/accounts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test-Account",
        category: "checking",
        balance: 600,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.account.name).toBe("TEST-ACCOUNT");
    expect(response.body.account.category).toBe("checking");
    expect(response.body.account.balance).toBe(600);
    expect(response.body.account.isFrozen).toBe(false);
  });

  //Delete
  test("It should delete an account", async () => {
    const { user, token, account } = await createAccountForAuthUser();
    const response = await request(app)
      .delete(`/accounts/${account._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      `Successfully deleted ${account.name} with ID: ${account._id}, Owner: ${user.name}`
    );
  });

  //Update
  test("It should update an account", async () => {
    const { user, token, account } = await createAccountForAuthUser();
    const response = await request(app)
      .put(`/accounts/${account._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "UPDATED ACCOUNT NAME",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.account.name).toBe("UPDATED ACCOUNT NAME");
    expect(response.body.account.category).toBe("checking");
    expect(response.body.account.balance).toBe(600);
    expect(response.body.account.isFrozen).toBe(false);
  });

  //Show
  test("It should show an account", async () => {
    const { token, account } = await createAccountForAuthUser();
    const response = await request(app)
      .get(`/accounts/${account._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.account.name).toBe("TEST-ACCOUNT");
    expect(response.body.account.category).toBe("checking");
    expect(response.body.account.balance).toBe(600);
    expect(response.body.account.isFrozen).toBe(false);
  });
});

//*Test suit for transactions
describe("Testing transaction-endpoints of api", () => {
  // Index
  test("It should return a list of transactions, from a chosen account of the logged in user", async () => {
    const { user, token, account, transaction } =
      await createTransactionForAccountOfAuthUser();
    const transaction2 = new Transaction({
      category: "withdraw",
      description: "Lunch money",
      amount: 50,
      forAccount: account,
    });
    transaction2.save();

    const response = await request(app)
      .get("/transactions")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("paginatedTransactions");
    expect(response.body.paginatedTransactions).toHaveProperty(
      "totalTransactions"
    );
    expect(response.body.paginatedTransactions).toHaveProperty("page");
    expect(response.body.paginatedTransactions).toHaveProperty("transactions");
  });

  // Create
  test("It should create a new transaction document", async () => {
    const { token, account } = await createAccountForAuthUser();
    const response = await request(app)
      .post("/transactions/withdraw")
      .set("Authorization", `Bearer ${token}`)
      .send({
        id: account._id,
        description: "Yay! we got paid",
        amount: 2,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.transaction.category).toEqual("withdraw");
    expect(response.body.transaction.description).toEqual("Yay! we got paid");
    expect(response.body.transaction.amount).toEqual(2);
  });

  // Show
  test("It should show a transaction document found by it's id", async () => {
    const { transaction, token, account } =
      await createTransactionForAccountOfAuthUser();
    const response = await request(app)
      .get(`/transactions/${transaction._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        id: account._id,
      });

    expect(response.statusCode).toBe(200);
  });
});
