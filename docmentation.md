**Technologies Used:**

- **Programming Language: JavaScript (Node.js)**
- **Database: MongoDB**
- **Authentication: JWT (JSON Web Tokens)**
- **Testing Framework: Jest**

**API Endpoints:**

- **User Registration:**
  - `POST /auth/register`
  - Request body is includes username and password.

- **User Login:**
  - `POST /auth/login`
  - Request body is includes username and password.
  
- **Create a new todo item:**
  - `POST /todos`
  - Request header is includes the JWT token for authentication.
  - Request body is includes title, description, and dueDate.

- **Retrieve all todo items for the authenticated user:**
  - `GET /todos`
  - Request header is includes the JWT token for authentication.
  
- **Update a todo item:**
  - `PUT /todos/{id}`
  - Request header is includes the JWT token for authentication.
  - Request body is includes title, description, dueDate, and status.
  
- **Delete a todo item:**
  - `DELETE /todos/{id}`
  - Request header is includes the JWT token for authentication.


   - **Get the next three tasks due:**
     - `GET /tasks/next-three`
     - Request header is includes the JWT token for authentication.


- **Webhook Listener:**
  - `POST /webhook`
  - Request body is includes event type and data payload in this format:
   {
  "eventType": "user_created",
  "data": {
    "user_id": 123,
    "username": "name",
    "email": "name@gmail.com"
  }
}

  
- **Admin Login:**
  - `POST /admin/login`
  - Request body is includes admin username and password.
  
- **View All Users:**
  - `GET /admin/users`
  - Request header is includes the admin JWT token for authentication.
  
- **View All Todos:**
  - `GET /admin/todos`
  - Request header is includes the admin JWT token for authentication.