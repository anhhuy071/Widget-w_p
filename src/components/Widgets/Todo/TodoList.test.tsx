import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import TodoList from "./TodoList";
import useTodoStore from "../../../stores/todoStore";

describe("TodoList", () => {
  beforeEach(() => {
    useTodoStore.setState({
      todos: [{ id: "1", text: "Review PR", completed: false }],
    });
  });

  it("renders todos and toggles completion", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    expect(screen.getByText("Review PR")).toBeInTheDocument();

    await user.click(screen.getByRole("checkbox", { name: /mark review pr as complete/i }));

    expect(useTodoStore.getState().todos[0]?.completed).toBe(true);
  });

  it("deletes a todo", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    await user.click(screen.getByRole("button", { name: /delete task/i }));

    expect(useTodoStore.getState().todos).toHaveLength(0);
  });
});
