import { AnimatePresence } from "framer-motion";
import useTodoStore from "../../../stores/todoStore";
import TodoItem from "./TodoItem";

const TodoList = () => {
  const { todos } = useTodoStore();

  if (todos.length === 0) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-6 text-center">
        <p className="font-semibold text-[var(--text-heading)]">No tasks yet.</p>
        <span className="mt-1 max-w-sm text-sm text-[var(--text-muted)]">
          Add your first item to start the day with a clear plan.
        </span>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <ul className="overflow-hidden rounded-lg border border-[var(--border)]">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </AnimatePresence>
  );
};

export default TodoList;
