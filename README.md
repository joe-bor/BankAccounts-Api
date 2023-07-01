# **Bank Accounts API**

- This is a simple RESTful API built using Express for server-side development. Mongoose is used to manage the database and JWT for secure authentication.

- This API enables clients to perform various operations, including user creation, login functionality, and the creation and management of user-linked accounts. Additionally, clients can easily handle transactions within these accounts.

- Link to [Trello](https://trello.com/b/oGNpr1ty/user-stories-ga-sei-project-2)

---

## _Entity Relationship Diagram_

![Screenshot that shows the relationships between the models used](https://i.imgur.com/bZiF9va.png)

---

## _Prerequisites_

- [Node.js](https://nodejs.org/en)

- [MongoDB account](https://account.mongodb.com/account/login)

- [Postman account](https://identity.getpostman.com/signup)

- [RapidApi account](https://rapidapi.com/auth/sign-up)

---

## _Installation & Setup_

- **Clone the repository**

  - Click on the [link](https://github.com/joe-bor/BankAccounts-Api.git) to go to my remote repository

  - Click on the green `Code` button

  - Copy the link they provided under `HTTPS` tab

  - Open up your terminal and create a new directory where you want the local repo to live, using

  ```
  mkdir <file-name>
  ```

  - Navigate into the directory using,

  ```
   cd <file-name>
  ```

  - Run the command, replacing the link with what we obtained from git hub

  ```
  git clone <link>
  ```

  - You should now have a copy of the project in your local repository

  - You can check by typing `ls` in your current location

  - Then run `cd BankAccounts-Api` to access the clone repo, then run

  ```
  code .
  ```

  - To open the entire directory

- **Check / Install Node**

  - In your terminal, run the command to check if you have Node.js installed

  ```
  node -v
  ```

  - If this returns a version number, you have node installed in your machine

  - Otherwise, visit their [website](https://nodejs.org/en) and download `LTS`

  - Now that we have node installed we can move on with the rest of the project set up

- **Project Setup**

  - Make sure you are in your local repo's directory. To check, use the command

  ```
  pwd
  ```

  - Once you are in the right directory, run

  ```
  npm i -g nodemon
  ```

  - To install all the rest of the dependencies inside the `package.json` we can run this command in our terminal

  ```
  npm i
  ```

  - We also need to create our `.env` file that contains all the sensitive information

  ```
  touch .env
  ```

  - The following should go inside the `.env`

  ```
  MONGO_URI=<connection string from MongoDB>
  ACCESS_TOKEN_SECRET=<256bit hash of your secret>
  API_KEY=<API key from RapidAPI>
  PORT=3000
  ```

  - With these we are now ready to use the API

---

## _Start app in dev mode_

- To go to development, run the command

```
npm run dev
```

- Essentially, we are telling nodemon to watch our server for changes, and every time we save a change, it automatically restarts the server for us.

- Now our server is running

---

## _API Request with Postman_

- Visit [Postman](https://www.postman.com/)

- Sign up for an account, and verify your email, if you don't already have one.

- [Download](https://www.postman.com/downloads/) Postman.

- ![Overview of Postman default workspace](https://i.imgur.com/KAgm4Rp.png)

- Beside the `Overview` tab, click the `+` to make a new request tab

  - This is where we configure the requests we will be sending to our server

- Send a request to our user create route

  - Choose `POST` as our HTTP Verb

  - type `http://localhost:3000/users/signup` in the URL bar

  - In the `body` tab, choose `raw` then `JSON` in the dropdown menu to it's right

  - Copy this code over into the body

  ```json
  {
    "name": "Test User",
    "email": "Test-email@test.com",
    "password": "Test-password!"
  }
  ```

  - And hit send

  - Below the request tab is our response tab

    - Choose `Pretty` and select `JSON` in the dropdown

  - You should see a response that looks similar to this:

  ```json
  {
    "user": {
      "name": "Test User",
      "email": "test-email@test.com",
      "password": "$2b$06$GC44SZxfwGVibFEk9zW7WuKwWRbeXr2tymEquh3bDOduNEiJLqjuW",
      "isLoggedIn": false,
      "_id": "64a05051fa21f48828ac1a0a",
      "accounts": [],
      "createdAt": "2023-07-01T16:12:01.330Z",
      "updatedAt": "2023-07-01T16:12:01.330Z",
      "__v": 0,
      "netWorth": 0,
      "id": "64a05051fa21f48828ac1a0a"
    }
  }
  ```

  - _Note: To access protected routes, there are a few step you must follow_

    - _Go to the `Authorization` tab of your request_

    - _Choose `Bearer Token` in the type dropdown_

    - _Copy the `token` you obtained from the login route_

  - ![Authorization in Postman](https://i.imgur.com/hWcB1qx.png)

---

## _Run Tests_

- Open up another terminal and follow the instructions below

- Load testing

  - To load test, we can run this command in the terminal

  - Additionally, you may edit the `artillery.yml` file to configure the stress test

```zsh
npm run load
```

- This is a summary of what the load test should return

- ![Load test results](https://i.imgur.com/qjr2Tnd.png)

- Unit Test for the endpoints

  - This is done with Jest and Supertest

  - All the tests are written in the `tests` directory

  - To initiate, simply run

```zsh
npm run test
```

- You should see something like this for test results

- ![Results of Unit Test](https://i.imgur.com/8H4s2X6.png)

---

## _Start the server_

- In your terminal, run this command to start the server without dev mode

```zsh
npm start
```

- Terminate the server by pressing `command + C` twice if you are using a mac

- Alternatively, you can type this command in your to kill all your servers in one command

```
pkill node
```
