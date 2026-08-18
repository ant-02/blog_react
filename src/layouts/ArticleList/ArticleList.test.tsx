import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import ArticleList from "./index";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("ArticleList", () => {
  it("renders category link when accessed directly without route state", () => {
    renderWithProviders(<ArticleList />);

    expect(screen.getByText("选择专题")).toBeInTheDocument();
    expect(screen.getByText("选择专题").closest("a")).toHaveAttribute("href", "/category");
  });
});
