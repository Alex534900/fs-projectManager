import { useEffect, useState } from "react";

import Header from "./components/Header";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import Footer from "./components/Footer";


type Task = {
    id: number;
    text: string;
    completed: boolean;
};


const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/+$/, "");


function App() {

    const [tasks, setTasks] = useState<Task[]>([]);


    // ==================================================
    // CARGAR TAREAS DESDE EL BACKEND
    // ==================================================

    useEffect(() => {

        const fetchTasks = async () => {

            try {

                const response = await fetch(
                    `${API_URL}/tasks`
                );


                if (!response.ok) {
                    throw new Error(
                        "No se pudieron cargar las tareas"
                    );
                }


                const data = await response.json();

                setTasks(data);


            } catch (error) {

                console.error(
                    "Error al cargar las tareas:",
                    error
                );

            }
        };


        fetchTasks();

    }, []);


    // ==================================================
    // CREAR TAREA
    // ==================================================

    const addTask = async (text: string) => {

        try {

            const response = await fetch(
                `${API_URL}/tasks`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        text: text
                    })
                }
            );


            if (!response.ok) {

                throw new Error(
                    "No se pudo crear la tarea"
                );

            }


            const newTask = await response.json();


            setTasks((currentTasks) => [
                ...currentTasks,
                newTask
            ]);


        } catch (error) {

            console.error(
                "Error al crear la tarea:",
                error
            );

        }
    };


    // ==================================================
    // ELIMINAR TAREA
    // Ahora también se elimina de PostgreSQL
    // ==================================================

    const deleteTask = async (id: number) => {

        try {

            const response = await fetch(
                `${API_URL}/tasks/${id}`,
                {
                    method: "DELETE"
                }
            );


            if (!response.ok) {

                throw new Error(
                    "No se pudo eliminar la tarea"
                );

            }


            // Solamente quitamos la tarea de React
            // después de que el servidor confirmó
            // que fue eliminada correctamente.

            setTasks((currentTasks) =>
                currentTasks.filter(
                    (task) => task.id !== id
                )
            );


        } catch (error) {

            console.error(
                "Error al eliminar la tarea:",
                error
            );

        }
    };


    // ==================================================
    // COMPLETAR / DESCOMPLETAR
    // Aún es solamente local.
    // Lo conectaremos después a PostgreSQL.
    // ==================================================

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


    // ==================================================
    // CONTADORES
    // ==================================================

    const completedTasks =
        tasks.filter(
            (task) => task.completed
        ).length;


    const pendingTasks =
        tasks.length - completedTasks;


    // ==================================================
    // INTERFAZ
    // ==================================================

    return (

        <div className="app-container">

            <Header />

            <TaskInput
                onAddTask={addTask}
            />

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