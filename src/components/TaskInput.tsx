import { useState } from "react";

type TaskInputProps = {
    onAddTask: (text: string) => void;
};

function TaskInput(props: TaskInputProps) {
    const [text, setText] = useState("");

    const handleSubmit = () => {
        if (text.trim() === "") {
            return;
        }

        props.onAddTask(text);
        setText("");
    };

    return (
        <div className="task-input-container">
            <input
                className="task-input"
                type="text"
                placeholder="Escribe una nueva tarea"
                value={text}
                onChange={(event) => setText(event.target.value)}
            />

            <button className="add-button" onClick={handleSubmit}>
                Agregar
            </button>
        </div>
    );
}

export default TaskInput;