//express server setup start
const express = require('express'); //import express module
const app = express(); //create express app
app.use(express.json());
//express server setup end


//database setup start
const Database = require("better-sqlite3");
const db = new Database("tasks.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE
  )
`);
//database setup end


// Prepared SQL statements start
// Prepare SQL queries once when the application starts.
// These compiled statements are reused throughout the app for better
// performance and protection against SQL injection.

const insertTask = db.prepare(`
  INSERT INTO tasks (title)
  VALUES (?)
`);

const getAllTasks = db.prepare(`
  SELECT * FROM tasks
`);

const getTaskById = db.prepare(`
  SELECT * FROM tasks
  WHERE id = ?
`);

const updateTask = db.prepare(`
  UPDATE tasks
  SET title = ?, completed = ?
  WHERE id = ?
`);

const deleteTask = db.prepare(`
  DELETE FROM tasks
  WHERE id = ?
`);
// Prepared SQL statements end


//swagger setup start
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Task API",
            version: "1.0.0",
            description: "A simple CRUD API for managing tasks"
        }
    },
    apis: ["./index.js"] // files containing OpenAPI definitions
};

const swaggerSpec = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//swagger setup end


//root endpoint
app.get("/", (req, res) => {
    res.json({
        name: "Task API",
        version: "1.0",
        endpoints: ["/tasks"]
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});


/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     description: Adds a new task to the todo list
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Learn Node.js
 *     responses:
 *       201:
 *         description: Task created successfully
 */

//post request to create a new task
app.post("/tasks", (req, res) => {
    const { title } = req.body;

    // Validation
    if (!title) {
        return res.status(400).json({
            message: "Title is required"
        });
    }

    // Insert into the database
    const result = insertTask.run(title);

    // Retrieve the newly inserted task
    const task = getTaskById.get(result.lastInsertRowid);

    // Send it back to the client
    res.status(201).json(task);
});


/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     description: Returns all tasks in the todo list
 *     responses:
 *       200:
 *         description: List of tasks retrieved successfully
 */

//retrieve all tasks
app.get("/tasks", (req, res) => {
    const tasks = getAllTasks.all();

    res.json(tasks);
});


/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     description: Returns one task using its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task found
 *       404:
 *         description: Task not found
 */

//retrieve specific task by id
app.get("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const task = getTaskById.get(id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    res.json(task);
});


/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     description: Updates an existing task by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 */

//update a specific task by id
app.put("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const { title, completed } = req.body;

    // Check if task exists
    const task = getTaskById.get(id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    // Update the task
    updateTask.run(title, completed, id);

    // Retrieve the updated task
    const updatedTask = getTaskById.get(id);

    res.json(updatedTask);
});


/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Deletes a task by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */

//delete a specific task by id
app.delete("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    // Check if task exists
    const task = getTaskById.get(id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    // Delete the task
    deleteTask.run(id);

    res.json(task);
});


//server
const PORT = 3000;

app.listen(PORT, () => {
    console.log("Listening on PORT 3000");
});