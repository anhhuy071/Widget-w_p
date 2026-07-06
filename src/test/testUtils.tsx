import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ReactElement } from "react";

export const renderWithRouter = (ui: ReactElement, options?: RenderOptions) =>
  render(ui, {
    wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    ...options,
  });

export const renderWithRoutes = (
  ui: ReactElement,
  initialEntries: string[] = ["/"],
  options?: RenderOptions,
) =>
  render(ui, {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    ),
    ...options,
  });
