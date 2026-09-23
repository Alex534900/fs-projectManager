
import { useEffect, useState } from "react";
//import { useState } from "react";
//import "./App.css";
import Header from "./components/Header";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import Footer from "./components/Footer";




type Task = {
    id: number;
    text: string;
    completed: boolean;
};
function App() {
    /*const [tasks, setTasks] = useState<Task[]>([
        { id: 1, text: "Estudiar React", completed: false },
        { id: 2, text: "Practicar TypeScript", completed: false },
        { id: 3, text: "Entender estado", completed: true }
    ]);*/
    const [tasks, setTasks] = useState<Task[]>([]);
    // NEW CHANGE: This loads tasks from the backend when React starts.
    useEffect(() => {
        const fetchTasks = async () => {
            const response = await fetch("http://localhost:3000/tasks");
            const data = await response.json();
            setTasks(data);
        };
        fetchTasks();
    }, []);
// NEW CHANGE: addTask now sends the new task to the backend using POST.
    const addTask = async (text: string) => {
        const response = await fetch("http://localhost:3000/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text
            })
        });
        const newTask = await response.json();
        setTasks([...tasks, newTask]);
    };

    
    const deleteTask = (id: number) => {
        const updatedTasks = tasks.filter((task) => task.id !== id);
        setTasks(updatedTasks);
    };
    const toggleTask = (id: number) => {
        const updatedTasks = tasks.map((task) => {
            if (task.id === id) {
                return {
                    ...task,
                    completed: !task.completed
                };
            }
            return task;
        });
        setTasks(updatedTasks);
    };
    const completedTasks = tasks.filter((task) => task.completed).length;
    const pendingTasks = tasks.length - completedTasks;
    return (
        <div className="app-container">
            <Header />
            <TaskInput onAddTask={addTask} />
            <TaskList
                tasks={tasks}
                onDeleteTask={deleteTask}
                onToggleTask={toggleTask}
            />
            <Footer
                total={tasks.length}
                completed={completedTasks}
                pending={pendingTasks}
            />
        </div>
    );
}
export default App;