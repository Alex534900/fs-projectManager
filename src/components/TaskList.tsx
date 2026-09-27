import TaskCard from "./TaskCard";
import EmptyState from "./EmptyState";
type Task = {
    id: number;
    text: string;
    completed: boolean;
};
type TaskListProps = {
    tasks: Task[];
    onDeleteTask: (id: number) => void;
    onToggleTask: (id: number) => void;
    onEditTask: (id: number, text: string) => void;
};
function TaskList(props: TaskListProps) {
    if (props.tasks.length === 0) {
        return <EmptyState />;
    }
    return (

        <ul>
            {props.tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onDeleteTask={props.onDeleteTask}
                    onToggleTask={props.onToggleTask}
                    onEditTask={props.onEditTask}
                />
            ))}
        </ul>
    );
}
export default TaskList;
