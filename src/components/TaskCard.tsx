import { useState } from "react";

type Task = {
    id: number;
    text: string;
    completed: boolean;
};
type TaskCardProps = {
    task: Task;
    onDeleteTask: (id: number) => void;
    onToggleTask: (id: number) => void;
    onEditTask: (id: number, text: string) => void;
};
function TaskCard(props: TaskCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [draftText, setDraftText] = useState(props.task.text);

    const startEditing = () => {
        setDraftText(props.task.text);
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setDraftText(props.task.text);
        setIsEditing(false);
    };

    const saveEditing = () => {
        if (draftText.trim() === "") {
            return;
        }

        props.onEditTask(props.task.id, draftText.trim());
        setIsEditing(false);
    };

    return (
        <li className={props.task.completed ? "task completed" : "task"}>
            <input
                type="checkbox"
                checked={props.task.completed}
                onChange={() => props.onToggleTask(props.task.id)}
            />

            {isEditing ? (
                <input
                    className="edit-input"
                    type="text"
                    aria-label="Editar tarea"
                    value={draftText}
                    autoFocus
                    onChange={(event) => setDraftText(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            saveEditing();
                        }
                        if (event.key === "Escape") {
                            cancelEditing();
                        }
                    }}
                />
            ) : (
                <span>{props.task.text}</span>
            )}

            {isEditing ? (
                <>
                    <button onClick={saveEditing}>Guardar</button>
                    <button onClick={cancelEditing}>Cancelar</button>
                </>
            ) : (
                <>
                    <button onClick={startEditing}>Editar</button>
                    <button onClick={() => props.onDeleteTask(props.task.id)}>
                        Eliminar
                    </button>
                </>
            )}
        </li>
    );
}
export default TaskCard;
