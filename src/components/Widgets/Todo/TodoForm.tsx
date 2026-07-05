import { useState } from "react";
import type { FormEvent } from "react";
import { FiPlus } from "react-icons/fi";
import useTodoStore from "../../../stores/todoStore";

const AddToDoForm = () => {
  const [text, setText] = useState("");
  const addTodo = useTodoStore((state) => state.addTodo);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!text.trim()) {
      return;
    }

    addTodo(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Add task">
      <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
        <input
          className="min-w-0 flex-auto rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-3.5 py-2.5 text-base text-[var(--text-heading)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none sm:text-sm"
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Write your next task..."
        />
        <button
          className="inline-flex flex-none items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--accent-strong)]"
          type="submit"
        >
          <FiPlus aria-hidden="true" />
          Add
        </button>
      </div>
    </form>
  );
};

export default AddToDoForm;
