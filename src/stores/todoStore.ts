import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Todo } from "../utils/todoUtils";
import { createTodoId, normalizeTodoText } from "../utils/todoUtils";

export type { Todo };

type TodoStore = {
  todos: Todo[];
  addTodo: (text: string) => void;
  removeTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  editTodo: (id: string, text: string) => void;
};

const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      todos: [],
      addTodo: (text) =>
        set((state) => {
          const normalizedText = normalizeTodoText(text);
          if (!normalizedText) return state;

          return {
            todos: [
              ...state.todos,
              { id: createTodoId(), text: normalizedText, completed: false },
            ],
          };
        }),
      removeTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((t) => t.id !== id),
        })),
      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo,
          ),
        })),
      editTodo: (id, text) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, text: normalizeTodoText(text) } : todo,
          ),
        })),
    }),
    {
      name: "todo-store",
    },
  ),
);

export default useTodoStore;
