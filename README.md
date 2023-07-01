# **Bank Accounts API**

- This is a simple RESTful API built using Express for server-side development. Mongoose is used to manage the database and JWT for secure authentication.

- This API enables clients to perform various operations, including user creation, login functionality, and the creation and management of user-linked accounts. Additionally, clients can easily handle transactions within these accounts.

- Link to [Trello](https://trello.com/b/oGNpr1ty/user-stories-ga-sei-project-2)

---

## _Entity Relationship Diagram_

![Screenshot that shows the relationships between the models used](https://i.imgur.com/bZiF9va.png)

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
  MONGO_URI=< connection string from MongoDB >
  ACCESS_TOKEN_SECRET=< 256bit hash of your secret >
  API_KEY=< API key from RapidAPI >

  ```

  - With these we are now ready to use the API

---

## _Start app in dev mode_

- To go to development, run the command

```
npm run dev

```

- Essentially, we are telling nodemon to watch our server for changes, and every time we save a change, it automatically restarts the server for us.

---

## _API Request with Postman_

-
-
- ***

## _Run Tests_

-
-
-
-

## Start the app