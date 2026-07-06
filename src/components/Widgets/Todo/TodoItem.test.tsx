import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import TodoItem from "./TodoItem";
import useTodoStore from "../../../stores/todoStore";

describe("TodoItem", () => {
  beforeEach(() => {
    useTodoStore.setState({
      todos: [{ id: "todo-1", text: "Write tests", completed: false }],
    });
  });

  it("edits a todo item", async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={{ id: "todo-1", text: "Write tests", completed: false }} />);

    await user.click(screen.getByRole("button", { name: /edit task/i }));
    const input = screen.getByDisplayValue("Write tests");
    await user.clear(input);
    await user.type(input, "Ship release");
    await user.click(screen.getByRole("button", { name: /save task/i }));

    expect(useTodoStore.getState().todos[0]?.text).toBe("Ship release");
  });
});
