# PowerX ToDo App 

Final Project for the subject Fundamentals in Backend Development in PowerX Program

## Briefing

### Project Title / Description:

Implement a collaborative TODO-list application

### Project Objective(s): 

Create a TODO-list CRUD API with these below endpoints:

- [Public] A registration endpoint that would accept an email and password, and rejects any emails that have been registered before
- [Public] A login endpoint that would return a JSON Web token that could be used on authenticated endpoint
- [Auth-ed] CRUD endpoints for TODO lists:
  - A Create endpoint with the list being created belongs to and can only be accessed by the creator or anyone added to access the list
  - A GET all TODO-list endpoint that would return an array of TODO-lists with their titles based on who the currently authenticated user is
  - A GET a single TODO-list by its ID endpoint that would return the corresponding TODO-list together with all of the items in the list based on who the current authenticated user is. Returns 403 forbidden with a proper error JSON object if the user cannot access the list
  - A PUT/PATCH endpoint to update a TODO-list’s title by its ID based on who the current authenticated user is. Returns 403 forbidden with a proper error JSON object if the user cannot access the list
  - A DELETE endpoint to remove a TODO-list. Soft-delete should be used
- [Auth-ed] An endpoint to add someone by email to be able to access a TODO list:
  - This operation should be processed in an event-driven manner: The endpoint would immediate respond with an appropriate 200 JSON response after putting an event into a message broker (recommended rabbitmq as there’s a free plan)
  - There will be a separate worker process that would consume the message and:
    - Do nothing if there’s no existing user with such email
    - Give the corresponding user with such email access to the list
    - Requeue the message if there are errors during processing
- [Auth-ed] CUD endpoints for items in a TODO list, only for those with access to the specific list:
  - Create an item in the list
  - Update an item in the list
  - Delete an item from the list. Soft delete should be used
  - Note: There’s no R endpoint as that’s been covered in the TODO-list CRUD endpoint

- The app should be deployed to heroku. For the database, you can use the heroku postgres plugin free tier. For the message broker, you can use the free tier from rabbitmq.
- The code should be covered with unit test for at least 50%

Bonus:

- Write integration tests with supertest for all endpoints
- Produce an OpenAPI yaml specs, and use it for request and response validation with express-openapi-validator
- Have a cronjob that update a global counter in the application on how many tasks have been completed for the entire user base every 5 minutes
- Have a public socket endpoint that would push updates on the above-mentioned counter whenever it’s updated

## My Implementation 

### Introduction 

- Implemented using Express.js, PostgreSQL and RabbitMQ 
- Authentication used to make sure users view/edit/delete only their items 

Following concepts have been applied: 

1. Express.js Routing 
2. CRUD operations with soft-delete
3. Middleware and Services 
4. Authentication using Token 
5. Dependency Injection 
6. Message Broker Concepts 
7. Unit Testing 
8. Integration Testing (Partial) 

### Implementation 

My application requires Postman to use. The following are description of the endpoints: 

#### 1. GET: `/` 

- Returns "Hello World" text 

#### 2. POST: `register/`

- Payload: 

  ```json
  {
      "username": [username],
      "email": [user_email],
      "password": [password]
  }
  ```

- Returns: 

  ```json
  {
      "token": [token]
  }
  ```

#### 3. POST: `login/`

- Payload: 

  ```json
  {
      "username": [username],
      "password": [password]
  }
  ```

- Returns: 

  ```json
  {
      "token": [token]
  }
  ```

#### 4. POST: `items/`

- Requires Header: `Authorization: Bearer [token]` 

- Payload: 

  ```json
  {
      "name": [task_name], 
      "is_deleted": false
  }
  ```

- Returns the newly added `Item` object 

#### 5. GET: `items/`

- Requires Header: `Authorization: Bearer [token]` 
- Returns the list of `Item` objects that belongs to the authorized user 

#### 6. GET: `items/[id]`

- Requires Header: `Authorization: Bearer [token]` 
- Returns: 
  - `Item` object if user is authorized to view and `Item` object still exist 
  - Error 400 if item is not found or deleted 
  - Error 403 if user is unauthorised 

#### 7. PUT: `items/[id]`

- Requires Header: `Authorization: Bearer [token]` 
- Returns: 
  - The newly modified`Item` object if the item was successfully modified 
  - Error 400 if item is not found or deleted 
  - Error 403 if user is unauthorised 

#### 8. DELETE: `items/[id]`

- Requires Header: `Authorization: Bearer [token]` 
- Returns: 
  - A text saying the item was successfully deleted if delete was successful 
  - Error 400 if item is not found or already deleted 
  - Error 403 if user is unauthorised 

### To Run Locally 

#### Requirements 

- **node.js** must be installed. test if successfully installed by running `node -v` 
- **Postman** or anything similar must be installed to test the API 
- **PostgreSQL** must be installed and a database `beday3` must be created 

#### Setup 

1. Run `npm install` to install the node modules 
2. Create the database (`todoapp`) in PostgreSQL if not created, then do the database migration by running `npm run db:migrate` 

#### Running Exercise Files 

1. Run `npm run start` to deploy the application locally 
2. Open Postman and start testing 
   - Refer to above for the endpoints

### To Run the Heroku Deployed App 

Open Postman and start testing using the base URL as [https://powerx-todo-app.herokuapp.com/](https://powerx-todo-app.herokuapp.com/). No setting up required. 


