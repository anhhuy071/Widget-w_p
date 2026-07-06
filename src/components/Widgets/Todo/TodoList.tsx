import { AnimatePresence } from "framer-motion";
import useTodoStore from "../../../stores/todoStore";
import TodoItem from "./TodoItem";
import { useTranslation } from "../../../utils/translations";

const TodoList = () => {
  const { todos } = useTodoStore();
  const { t } = useTranslation();

  if (todos.length === 0) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-6 text-center">
        <p className="font-semibold text-[var(--text-heading)]">{t("noTodos")}</p>
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
