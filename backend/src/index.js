const express = require("express");
const cors = require("cors");
// JWT: We import jsonwebtoken to create and verify tokens.
const jwt = require("jsonwebtoken");
// PRISMA CHANGE: Import Prisma Client
const { PrismaClient } = require("@prisma/client");
const app = express();
const PORT = 3000;
// PRISMA CHANGE: Create the connection to PostgreSQL through Prisma
const prisma = new PrismaClient();
app.use(express.json());
app.use(cors());
app.use(express.json());
// This array is still here because POST, PUT, and DELETE are not connected to Prismayet.
// PRISMA CHANGE: GET /tasks will no longer use this array.
let tasks = [
    { id: 1, text: "Estudiar Node.js", completed: false },
    { id: 2, text: "Crear servidor Express", completed: true },
    { id: 3, text: "Probar rutas del backend", completed: false }
];
app.get("/", (req, res) => {
    res.send("Backend is working!");
});
// PRISMA CHANGE: GET /tasks now reads from PostgreSQL instead of the array
app.get("/tasks", async (req, res) => {
    const tasksFromDatabase = await prisma.task.findMany();
    res.json(tasksFromDatabase);
});
/*app.post("/tasks", (req: any, res: any) => {
    const { text } = req.body || {};
    if (!text || text.trim() === "") {
        return res.status(400).json({ message: "Task text is required" });
    }
    const newTask: Task = { id: Date.now(), text: text, completed: false };
    tasks.push(newTask);
    res.status(201).json(newTask);
});*/
// JWT: This is a basic login route.
// JWT: For now, we are using fixed credentials only for practice.
app.post("/login", (req, res) => {
    const { email, password } = req.body || {};
    if (email === "admin@test.com" && password === "123456") {
        // JWT: If the credentials are correct, we create a token.
        const token = jwt.sign(
        // JWT: This is the information stored inside the token.
        { email: email }, 
        // JWT: This secret is used to sign the token.
        "secret_key", 
        // JWT: The token will expire in 1 hour.
        { expiresIn: "1h" });
        return res.json({
            message: "Login successful",
            token: token
        });
    }
    res.status(401).json({
        message: "Invalid credentials"
    });
});
// NEW JWT CHANGE: This is a protected route.
// NEW JWT CHANGE: The user must send a valid token to access this route.
app.get("/profile", (req, res) => {
    // NEW JWT CHANGE: The token is expected in the Authorization header.
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            message: "No token provided"
        });
    }
    // NEW JWT CHANGE: The header usually looks like "Bearer token_here".
    // NEW JWT CHANGE: We split it and take only the token part.
    const token = authHeader.split(" ")[1];
    try {
        // NEW JWT CHANGE: jwt.verify checks if the token is valid.
        const decoded = jwt.verify(token, "secret_key");
        res.json({
            message: "Protected profile data",
            user: decoded
        });
    }
    catch (error) {
        res.status(401).json({
            message: "Invalid token"
        });
    }
});
// NEW CHANGE: POST /tasks now saves the new task in PostgreSQL using Prisma.
app.post("/tasks", async (req, res) => {
    const { text } = req.body || {};
    if (!text || text.trim() === "") {
        return res.status(400).json({
            message: "Task text is required"
        });
    }
    const newTask = await prisma.task.create({
        data: {
            text: text,
            completed: false
        }
    });
    res.status(201).json(newTask);
});
app.put("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find((task) => task.id === id);
    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }
    task.completed = !task.completed;
    res.json(task);
});
app.delete("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const taskExists = tasks.some(task => task.id === id);
    if (!taskExists) {
        return res.status(404).json({
            message: "Task not found"
        });
    }
    const updatedTasks = tasks.filter(task => task.id !== id);
    tasks.length = 0;
    tasks.push(...updatedTasks);
    res.status(200).json({
        message: "Task deleted successfully",
        tasks
    });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
export {};
//# sourceMappingURL=index.js.map