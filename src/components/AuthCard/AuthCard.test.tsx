import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { AuthCard } from "./index";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("AuthCard", () => {
  it("should accept non-digit characters in password", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AuthCard mode="login" close={() => {}} switchMode={() => {}} />);

    const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
    await user.type(passwordInput, "Abc123!@#");

    expect(passwordInput).toHaveValue("Abc123!@#");
  });
});
