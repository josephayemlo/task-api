# Task API

A RESTful Task Management API built with **Node.js**, **Express**, and **PostgreSQL**.

This project provides full CRUD operations for managing tasks, uses **PostgreSQL** with the **pg** library for persistent data storage, and includes **Swagger UI documentation** for exploring and testing the API.

## Features

* Create tasks
* Retrieve all tasks
* Retrieve a single task by ID
* Update tasks
* Delete tasks
* Persistent data storage with PostgreSQL
* API documentation with Swagger UI
* Health check endpoint
* JSON-based REST API

---

## Tech Stack

* Node.js
* Express.js
* PostgreSQL
* pg
* dotenv
* Swagger UI Express
* Swagger JSDoc
* Nodemon (development)

---

## Installation & Running

Clone the repository:

```bash
git clone https://github.com/josephayemlo/task-api.git
```

Navigate into the project directory:

```bash
cd task-api
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root and configure your PostgreSQL connection:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=taskdb
```

Ensure PostgreSQL is running and the `taskdb` database exists.

Run the application:

```bash
npm run dev
```

The API will start on:

```
http://localhost:3000
```

Swagger documentation is available at:

```
http://localhost:3000/api-docs
```

---

## API Endpoints

| Method | Endpoint     | Description           |
| ------ | ------------ | --------------------- |
| POST   | `/tasks`     | Create a new task     |
| GET    | `/tasks`     | Retrieve all tasks    |
| GET    | `/tasks/:id` | Retrieve a task by ID |
| PUT    | `/tasks/:id` | Update a task         |
| DELETE | `/tasks/:id` | Delete a task         |

---

## Database

This project uses **PostgreSQL** for persistent data storage.

The application automatically creates the `tasks` table if it does not already exist.

The `tasks` table contains the following fields:

| Column    | Type         | Description                                  |
| --------- | ------------ | -------------------------------------------- |
| id        | SERIAL       | Primary key, auto-increment                  |
| title     | VARCHAR(255) | Task title                                   |
| completed | BOOLEAN      | Task completion status (defaults to `FALSE`) |

---

## Environment Variables

The application uses the following environment variables:

| Variable      | Description                   |
| ------------- | ----------------------------- |
| `PORT`        | Port on which the server runs |
| `DB_HOST`     | PostgreSQL server host        |
| `DB_PORT`     | PostgreSQL server port        |
| `DB_USER`     | PostgreSQL username           |
| `DB_PASSWORD` | PostgreSQL password           |
| `DB_NAME`     | PostgreSQL database name      |
