export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export const normalizeTodoText = (text: string) =>
  text.trim().replace(/\s+/g, " ").slice(0, 160);

export const createTodoId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
