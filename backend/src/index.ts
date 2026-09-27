const express = require("express");
const cors = require("cors");

// JWT
const jwt = require("jsonwebtoken");

// Prisma
const { PrismaClient } = require("@prisma/client");

const app = express();

const PORT = Number(process.env.PORT) || 3000;

// ======================================================
// VARIABLES SENSIBLES
// ======================================================

// JWT_SECRET ya NO está escrito directamente en el código.
// Debe venir desde una variable de entorno.
const JWT_SECRET = process.env.JWT_SECRET;

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());


type Task = {
    id: number;
    text: string;
    completed: boolean;
};


// Este arreglo todavía se mantiene porque PUT aún no usa Prisma.
// Después conectaremos también el checkbox a PostgreSQL.
const tasks: Task[] = [
    { id: 1, text: "Estudiar Node.js", completed: false },
    { id: 2, text: "Crear servidor Express", completed: true },
    { id: 3, text: "Probar rutas del backend", completed: false }
];


// ======================================================
// GET /
// ======================================================

app.get("/", (_req: any, res: any) => {

    res.send("Backend is working!");

});


// ======================================================
// GET /tasks
// Lee las tareas desde PostgreSQL
// ======================================================

app.get("/tasks", async (_req: any, res: any) => {

    try {

        const tasksFromDatabase =
            await prisma.task.findMany();

        return res.json(tasksFromDatabase);

    } catch (error) {

        console.error(
            "Error getting tasks:",
            error
        );

        return res.status(500).json({
            message: "Error getting tasks"
        });

    }

});


// ======================================================
// LOGIN
// ======================================================

app.post("/login", (req: any, res: any) => {

    const { email, password } = req.body || {};


    // Verificamos que JWT_SECRET exista.
    if (!JWT_SECRET) {

        console.error(
            "JWT_SECRET environment variable is not configured"
        );

        return res.status(500).json({
            message: "Server configuration error"
        });

    }


    if (
        email === "admin@test.com" &&
        password === "123456"
    ) {

        const token = jwt.sign(
            {
                email: email
            },
            JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );


        return res.json({
            message: "Login successful",
            token: token
        });

    }


    return res.status(401).json({
        message: "Invalid credentials"
    });

});


// ======================================================
// PROFILE PROTEGIDO CON JWT
// ======================================================

app.get("/profile", (req: any, res: any) => {

    const authHeader =
        req.headers.authorization;


    if (!authHeader) {

        return res.status(401).json({
            message: "No token provided"
        });

    }


    // Verificamos nuevamente que la variable exista.
    if (!JWT_SECRET) {

        console.error(
            "JWT_SECRET environment variable is not configured"
        );

        return res.status(500).json({
            message: "Server configuration error"
        });

    }


    const token =
        authHeader.split(" ")[1];


    if (!token) {

        return res.status(401).json({
            message: "Invalid authorization header"
        });

    }


    try {

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );


        return res.json({
            message: "Protected profile data",
            user: decoded
        });

    } catch {

        return res.status(401).json({
            message: "Invalid token"
        });

    }

});


// ======================================================
// POST /tasks
// Crea una tarea en PostgreSQL
// ======================================================

app.post("/tasks", async (req: any, res: any) => {

    const { text } = req.body || {};


    if (
        !text ||
        text.trim() === ""
    ) {

        return res.status(400).json({
            message: "Task text is required"
        });

    }


    try {

        const newTask =
            await prisma.task.create({

                data: {
                    text: text.trim(),
                    completed: false
                }

            });


        return res
            .status(201)
            .json(newTask);

    } catch (error) {

        console.error(
            "Error creating task:",
            error
        );


        return res.status(500).json({
            message: "Error creating task"
        });

    }

});


// ======================================================
// PUT /tasks/:id
// POR AHORA sigue usando el arreglo temporal.
// Después lo conectaremos a Prisma.
// ======================================================

app.put("/tasks/:id", (req: any, res: any) => {

    const id =
        Number(req.params.id);


    const task =
        tasks.find(
            (task) => task.id === id
        );


    if (!task) {

        return res.status(404).json({
            message: "Task not found"
        });

    }


    task.completed =
        !task.completed;


    return res.json(task);

});


// ======================================================
// DELETE /tasks/:id
// Elimina realmente de PostgreSQL con Prisma
// ======================================================

app.delete(
    "/tasks/:id",
    async (req: any, res: any) => {

        const id =
            Number(req.params.id);


        if (Number.isNaN(id)) {

            return res.status(400).json({
                message: "Invalid task id"
            });

        }


        try {

            const result =
                await prisma.task.deleteMany({

                    where: {
                        id: id
                    }

                });


            if (result.count === 0) {

                return res.status(404).json({
                    message: "Task not found"
                });

            }


            return res.status(200).json({
                message:
                    "Task deleted successfully"
            });


        } catch (error) {

            console.error(
                "Error deleting task:",
                error
            );


            return res.status(500).json({
                message:
                    "Error deleting task"
            });

        }

    }
);


// ======================================================
// START SERVER
// ======================================================

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});