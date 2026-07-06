import { useState, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import { FiCheck, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import useTodoStore from "../../../stores/todoStore";
import type { Todo } from "../../../stores/todoStore";

type TodoItemProps = {
  todo: Todo;
};

const variants = {
  initial: { opacity: 0, y: 50 },
  animation: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

export default function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, removeTodo, editTodo } = useTodoStore();
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo.text);

  const handleEdit = () => {
    const trimmedText = newText.trim();
    if (isEditing && trimmedText !== "") {
      editTodo(todo.id, trimmedText);
    }

    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setNewText(todo.text);
    setIsEditing(false);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewText(event.target.value);
  };

  return (
    <motion.li
      variants={variants}
      initial="initial"
      animate="animation"
      exit="exit"
      layout
      className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)] p-4 transition-all last:border-b-0 hover:bg-[var(--accent-soft)] sm:gap-4">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
        aria-label={`Mark ${todo.text} as ${todo.completed ? "incomplete" : "complete"}`}
        className="w-5 h-5 cursor-pointer accent-[var(--accent)]"
      />
      <div className="flex min-w-0 items-center">
        {isEditing ? (
          <input
            type="text"
            value={newText}
            onChange={handleChange}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleEdit();
              if (event.key === "Escape") handleCancel();
            }}
            autoFocus
            className="w-full border-b border-[var(--accent)] bg-transparent py-1 text-[var(--text-heading)] outline-none focus:ring-0"
          />
        ) : (
          <span
            className={`truncate text-base transition-all duration-300 sm:text-lg ${
              todo.completed
                ? "text-[var(--text-muted)] line-through opacity-60"
                : "text-[var(--text-heading)]"
            }`}
          >
            {todo.text}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleEdit}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text-heading)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          aria-label={isEditing ? "Save task" : "Edit task"}
        >
          {isEditing ? <FiCheck aria-hidden="true" /> : <FiEdit2 aria-hidden="true" />}
        </button>
        {isEditing && (
          <button
            onClick={handleCancel}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] transition-colors hover:text-[var(--text-heading)]"
            aria-label="Cancel edit"
          >
            <FiX aria-hidden="true" />
          </button>
        )}
        <button
          onClick={() => removeTodo(todo.id)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-rose-500/10 text-rose-600 transition-all hover:bg-rose-600 hover:text-white"
          aria-label="Delete task"
        >
          <FiTrash2 aria-hidden="true" />
        </button>
      </div>
    </motion.li>
  );
}
