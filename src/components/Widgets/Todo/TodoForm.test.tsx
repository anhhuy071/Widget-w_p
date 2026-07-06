import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import AddToDoForm from "./TodoForm";
import useTodoStore from "../../../stores/todoStore";
import useProfileStore from "../../../stores/profileStore";

describe("AddToDoForm", () => {
  beforeEach(() => {
    useTodoStore.setState({ todos: [] });
    useProfileStore.setState({ language: "en" });
  });

  it("adds a todo when form is submitted", async () => {
    const user = userEvent.setup();
    render(<AddToDoForm />);

    await user.type(screen.getByPlaceholderText(/write your next task/i), "Ship release");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(useTodoStore.getState().todos).toHaveLength(1);
    expect(useTodoStore.getState().todos[0]?.text).toBe("Ship release");
  });
});
