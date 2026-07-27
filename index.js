//express server setup start
const express = require('express')//import express module
const app = express(); //create express app
app.use(express.json());
//express server setup end

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

// In-memory storage for tasks
const tasks = []; 
// Array to store tasks in memory( it uses RAM to store data, 
// so the data will be lost when the server restarts. In a real-world application, 
// we would typically use a database to persist data.) 

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
    const task = {
        id: Date.now(),
        title: req.body.title, // Get the task title from the request body
        completed: false
    };

    tasks.push(task);

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

// retreive specific task by id
app.get("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
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


// update a specific task by id
app.put("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    task.title = req.body.title;
    task.completed = req.body.completed;

    res.json(task);
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


// delete a specific task by id
app.delete("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = tasks.findIndex(task => task.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Task not found" });
    }

    const deletedTask = tasks.splice(index, 1);

    res.json(deletedTask[0]);
});
// server
const PORT = 3000
app.listen(PORT, ()=> {
    console.log('Listening on PORT 3000')
})