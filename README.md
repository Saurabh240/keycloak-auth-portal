# Auth Portal Project

This project provides a ready-to-run stack:
- **Keycloak** for authentication
- **React UI** as the portal
- **Spring Boot API** as a backend service
- **Docker Compose** orchestration

## 🚀 Quick Start

### 1️⃣ Prerequisites
- Docker and Docker Compose installed.

### 2️⃣ Running the project
```bash
docker-compose up --build
```

This will start:
- Keycloak on [http://localhost:8080](http://localhost:8080)
- React UI on [http://localhost:3000](http://localhost:3000)
- Spring API on [http://localhost:8081](http://localhost:8081)

### 3️⃣ Keycloak credentials
```
Admin Username: admin
Admin Password: admin
```

Access Keycloak admin console at [http://localhost:8080/admin](http://localhost:8080/admin).

### 4️⃣ Realm import
A preconfigured realm export (`euranix-realm.json`) is provided.

#### Import steps:
1. Log in to Keycloak Admin console.
2. Go to **Add realm > Import**.
3. Upload `euranix-realm.json` from project folder.
4. Realm `euranix` will be imported with:
   - Clients for `portal-ui` and `custom-app`
   - Roles: `admin`, `user`
   - Example users (admin/admin123).

### 5️⃣ Persistence
Docker Compose config uses **PostgreSQL database for Keycloak persistence** (not ephemeral H2).

## 📂 Project structure
```
/react-ui         # React frontend
/spring-api       # Spring Boot backend
/docker-compose.yml
/euranix-realm.json
```

## 🔔 Notes
- `React UI` uses `keycloak-js` for authentication.
- `Spring API` secured with Keycloak adapter and role-based access.


### 📃 **API Endpoints summary**

| Method | URL                 | Description       | Auth required | Role required |
| ------ | ------------------- | ----------------- | ------------- | ------------- |
| GET    | `/admin/users`      | List all users    | Yes (Bearer)  | `admin`       |
| POST   | `/admin/users`      | Create a new user | Yes (Bearer)  | `admin`       |
| GET    | `/admin/users/{id}` | Get user by ID    | Yes (Bearer)  | `admin`       |
| PUT    | `/admin/users/{id}` | Update user by ID | Yes (Bearer)  | `admin`       |
| DELETE | `/admin/users/{id}` | Delete user by ID | Yes (Bearer)  | `admin`       |

---

### 🔐 **JWT requirements:**

* All endpoints secured:

   * Bearer token required
   * Must contain `admin` role (`realm_access.roles` from Keycloak JWT)

---

### 🔧 **JSON Schema for User object**

#### 📦 Example `User` resource:

```json
{
  "id": "1",
  "username": "user1",
  "email": "user1@example.com",
  "roles": ["user"]
}
```

#### 🔧 JSON Schema:

```json
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "username": { "type": "string" },
    "email": { "type": "string", "format": "email" },
    "roles": {
      "type": "array",
      "items": { "type": "string" }
    }
  },
  "required": ["username", "email"]
}
```

---

### 🌀 **Detailed API contract + `curl` examples**

#### 1️⃣ `GET /admin/users`

* **Description:** Get list of all users

* **Response:**

  ```json
  [
    { "id": "1", "username": "user1", "email": "user1@example.com", "roles": ["user"] },
    { "id": "2", "username": "admin1", "email": "admin1@example.com", "roles": ["admin"] }
  ]
  ```

* **Example `curl`:**

  ```bash
  curl -X GET http://localhost:8081/admin/users \
    -H "Authorization: Bearer <ACCESS_TOKEN>"
  ```

---

#### 2️⃣ `POST /admin/users`

* **Description:** Create new user

* **Request body:**

  ```json
  {
    "username": "newuser",
    "email": "newuser@example.com",
    "roles": ["user"]
  }
  ```

* **Response:**

  ```json
  { "id": "3", "username": "newuser", "email": "newuser@example.com", "roles": ["user"] }
  ```

* **Example `curl`:**

  ```bash
  curl -X POST http://localhost:8081/admin/users \
    -H "Authorization: Bearer <ACCESS_TOKEN>" \
    -H "Content-Type: application/json" \
    -d '{"username":"newuser","email":"newuser@example.com","roles":["user"]}'
  ```

---

#### 3️⃣ `GET /admin/users/{id}`

* **Description:** Get user by ID

* **Example `curl`:**

  ```bash
  curl -X GET http://localhost:8081/admin/users/1 \
    -H "Authorization: Bearer <ACCESS_TOKEN>"
  ```

---

#### 4️⃣ `PUT /admin/users/{id}`

* **Description:** Update user info

* **Request body:**

  ```json
  {
    "username": "updateduser",
    "email": "updated@example.com",
    "roles": ["admin"]
  }
  ```

* **Example `curl`:**

  ```bash
  curl -X PUT http://localhost:8081/admin/users/1 \
    -H "Authorization: Bearer <ACCESS_TOKEN>" \
    -H "Content-Type: application/json" \
    -d '{"username":"updateduser","email":"updated@example.com","roles":["admin"]}'
  ```

---

#### 5️⃣ `DELETE /admin/users/{id}`

* **Description:** Delete user by ID

* **Example `curl`:**

  ```bash
  curl -X DELETE http://localhost:8081/admin/users/1 \
    -H "Authorization: Bearer <ACCESS_TOKEN>"
  ```

---

### 📝 **Error handling contract:**

| Code | Reason                    |
| ---- | ------------------------- |
| 200  | Success (GET/PUT)         |
| 201  | Created (POST)            |
| 204  | No Content (DELETE)       |
| 400  | Bad request               |
| 401  | Unauthorized              |
| 403  | Forbidden (no admin role) |
| 404  | Not Found                 |