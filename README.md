# Task API

A RESTful Task Management API built with **Node.js**, **Express**, and **SQLite**.

This project provides full CRUD operations for managing tasks, uses **SQLite** with **better-sqlite3** for persistent data storage, and includes **Swagger UI documentation** for exploring and testing the API.

## Features

- Create tasks
- Retrieve all tasks
- Retrieve a single task by ID
- Update tasks
- Delete tasks
- Persistent data storage with SQLite
- API documentation with Swagger UI
- Health check endpoint
- JSON-based REST API

---

## Tech Stack

- Node.js
- Express.js
- SQLite
- better-sqlite3
- Swagger UI Express
- Swagger JSDoc
- Nodemon (development)

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

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tasks` | Create a new task |
| GET | `/tasks` | Retrieve all tasks |
| GET | `/tasks/:id` | Retrieve a task by ID |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

---

## Database

This project uses **SQLite** with **better-sqlite3** for persistent storage.

The database file (`tasks.db`) is created automatically when the application starts if it does not already exist.

The `tasks` table contains the following fields:

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key, auto-increment |
| title | TEXT | Task title |
| completed | BOOLEAN | Task completion status (defaults to `false`) |