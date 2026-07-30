//express server setup start
const express = require('express'); //import express module
const app = express(); //create express app
app.use(express.json());
//express server setup end


//database setup start
const pool = require("./db");
//database setup end



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
app.post("/tasks", async (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({
            message: "Title is required"
        });
    }

    try {
        const result = await pool.query(
            "INSERT INTO tasks (title) VALUES ($1) RETURNING *",
            [title]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
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
app.get("/tasks", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM tasks ORDER BY id"
        );

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
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
app.get("/tasks/:id", async (req, res) => {
    const id = Number(req.params.id);

    try {
        const result = await pool.query(
            "SELECT * FROM tasks WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
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
app.put("/tasks/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { title, completed } = req.body;

    try {
        const result = await pool.query(
            `
            UPDATE tasks
            SET title = $1, completed = $2
            WHERE id = $3
            RETURNING *
            `,
            [title, completed, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
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
app.delete("/tasks/:id", async (req, res) => {
    const id = Number(req.params.id);

    try {
        const result = await pool.query(
            "DELETE FROM tasks WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

//server
const PORT = 3000;

app.listen(PORT, () => {
    console.log("Listening on PORT 3000");
});